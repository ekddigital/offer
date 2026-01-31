import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmailAdvanced } from "@/lib/api/ekdsend";
import { generateOTP, generateOTPExpiration } from "@/lib/auth/otp";
import { getVerificationEmailTemplate } from "@/lib/auth/email-templates";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 },
      );
    }

    const { email, password, name } = parsed.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      // If user exists but is not verified, allow re-registration with new OTP
      if (!existingUser.emailVerified && !existingUser.isActive) {
        // Generate new OTP
        const otpCode = generateOTP();
        const otpExpiration = generateOTPExpiration();

        // Update user with new OTP and password
        const hashedPassword = await bcrypt.hash(password, 12);

        await db.user.update({
          where: { email: email.toLowerCase() },
          data: {
            name,
            pwdHash: hashedPassword,
            emailVerificationCode: otpCode,
            emailVerificationExp: otpExpiration,
          },
        });

        // Send verification email
        const emailTemplate = getVerificationEmailTemplate(name, otpCode);

        try {
          await sendEmailAdvanced({
            to: email.toLowerCase(),
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
          });
        } catch (emailError) {
          console.error("Failed to send verification email:", emailError);
          return NextResponse.json(
            { error: "Failed to send verification email. Please try again." },
            { status: 500 },
          );
        }

        return NextResponse.json(
          {
            success: true,
            message: "Verification code sent to your email",
            requiresVerification: true,
          },
          { status: 200 },
        );
      } else {
        // User already exists and is verified/active
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 },
        );
      }
    }

    // Hash password
    const pwdHash = await bcrypt.hash(password, 12);

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiration = generateOTPExpiration();

    // Create user with verification pending
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        pwdHash,
        role: "BUYER",
        emailVerificationCode: otpCode,
        emailVerificationExp: otpExpiration,
        isActive: false, // User is not active until email is verified
      },
    });

    // Send verification email
    const emailTemplate = getVerificationEmailTemplate(name, otpCode);

    try {
      await sendEmailAdvanced({
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);

      // If email fails, delete the created user to allow retry
      await db.user.delete({
        where: { id: user.id },
      });

      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully. Please check your email for verification code.",
        requiresVerification: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}
