import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmailAdvanced } from "@/lib/api/ekdsend";

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
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const pwdHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        pwdHash,
        role: "BUYER",
      },
    });

    // Send welcome email
    try {
      await sendEmailAdvanced({
        to: user.email,
        subject: "Welcome to AND Offer",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0B1F3A;">Welcome to AND Offer, ${user.name}!</h1>
            <p>Thank you for creating an account with us.</p>
            <p>You can now sign in and start exploring our products sourced directly from verified Chinese suppliers.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              Best regards,<br>
              The AND Offer Team<br>
              A.N.D. GROUP OF COMPANIES LLC
            </p>
          </div>
        `,
        text: `Welcome to AND Offer, ${user.name}! Thank you for creating an account with us.`,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the signup if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
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
