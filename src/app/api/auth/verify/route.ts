import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { isValidOTP } from "@/lib/auth/otp";
import { sendEmailAdvanced } from "@/lib/api/ekdsend";
import { getWelcomeEmailTemplate } from "@/lib/auth/email-templates";

const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = verifyEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 },
      );
    }

    const { email, code } = parsed.data;

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

    // Validate OTP
    if (
      !isValidOTP(code, user.emailVerificationCode, user.emailVerificationExp)
    ) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    // Update user - mark as verified and active
    const updatedUser = await db.user.update({
      where: { email: email.toLowerCase() },
      data: {
        emailVerified: new Date(),
        isActive: true,
        emailVerificationCode: null,
        emailVerificationExp: null,
      },
    });

    // Send welcome email
    try {
      const welcomeTemplate = getWelcomeEmailTemplate(updatedUser.name || "");
      await sendEmailAdvanced({
        to: updatedUser.email,
        subject: welcomeTemplate.subject,
        html: welcomeTemplate.html,
        text: welcomeTemplate.text,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail verification if welcome email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          emailVerified: updatedUser.emailVerified,
          isActive: updatedUser.isActive,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 },
    );
  }
}
