import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { generateOTP, generateOTPExpiration } from "@/lib/auth/otp";
import { sendEmailAdvanced } from "@/lib/api/ekdsend";
import { getVerificationEmailTemplate } from "@/lib/auth/email-templates";

const resendVerificationSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resendVerificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 },
      );
    }

    const { email } = parsed.data;

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already verified
    if (user.emailVerified && user.isActive) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 },
      );
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpiration = generateOTPExpiration();

    // Update user with new OTP
    await db.user.update({
      where: { email: email.toLowerCase() },
      data: {
        emailVerificationCode: otpCode,
        emailVerificationExp: otpExpiration,
      },
    });

    // Send verification email
    const emailTemplate = getVerificationEmailTemplate(
      user.name || "",
      otpCode,
    );

    try {
      await sendEmailAdvanced({
        to: user.email,
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
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification code" },
      { status: 500 },
    );
  }
}
