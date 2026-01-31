import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmailAdvanced } from "@/lib/api/ekdsend";
import { generateOTP, generateOTPExpiration } from "@/lib/auth/otp";
import { getVerificationEmailTemplate } from "@/lib/auth/email-templates";
import { env } from "@/lib/env";

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

    // Check if email API key is properly configured (not a placeholder)
    if (!env.ANDOFFER_MAIL_API_KEY || env.ANDOFFER_MAIL_API_KEY === "ek_build_placeholder") {
      console.error("❌ Email service not properly configured:", {
        hasKey: !!env.ANDOFFER_MAIL_API_KEY,
        isPlaceholder: env.ANDOFFER_MAIL_API_KEY === "ek_build_placeholder",
        keyPrefix: env.ANDOFFER_MAIL_API_KEY?.substring(0, 10) + "...",
      });
      return NextResponse.json(
        { 
          error: "Email service is not properly configured. Please contact support.",
          details: "The application is using placeholder configuration values."
        },
        { status: 500 },
      );
    }

    console.log(
      "📧 Email API Key present:",
      env.ANDOFFER_MAIL_API_KEY ? "✅ Yes" : "❌ No",
    );
    console.log("📧 Default FROM email:", env.ANDOFFER_DEFAULT_FROM);

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

    console.log("📧 Attempting to send verification email to:", user.email);
    console.log("📧 Email template generated:", {
      subject: emailTemplate.subject,
      hasHtml: !!emailTemplate.html,
      hasText: !!emailTemplate.text,
    });

    try {
      const emailPayload = {
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      };

      console.log("📧 Sending email with payload:", {
        to: emailPayload.to,
        subject: emailPayload.subject,
        from: env.ANDOFFER_DEFAULT_FROM,
        htmlLength: emailPayload.html?.length || 0,
        textLength: emailPayload.text?.length || 0,
      });

      const emailResult = await sendEmailAdvanced(emailPayload);

      console.log("📧 Email sent successfully:", emailResult);

      // Check if we're in sandbox mode and inform the user
      const isSandboxMode = emailResult.sandbox === true;

      if (isSandboxMode) {
        console.log(
          "🧪 SANDBOX MODE: Email stored in sandbox, not delivered to real inbox",
        );
        console.log("🧪 To view sandbox emails, visit: /api/debug/sandbox");
      }
    } catch (emailError) {
      console.error("❌ Failed to send verification email:", emailError);
      console.error("❌ Email error details:", {
        message:
          emailError instanceof Error ? emailError.message : String(emailError),
        stack: emailError instanceof Error ? emailError.stack : undefined,
      });

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
