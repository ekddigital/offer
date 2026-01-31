export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function getVerificationEmailTemplate(
  name: string,
  otpCode: string,
): EmailTemplate {
  return {
    subject: "Verify your AND Offer account",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0B1F3A 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">AND Offer</h1>
          <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px;">A.N.D. GROUP OF COMPANIES LLC</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #0B1F3A; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
            Verify your email address
          </h2>
          
          <p style="color: #374151; margin: 0 0 24px 0; font-size: 16px; line-height: 1.5;">
            Hi ${name},
          </p>
          
          <p style="color: #374151; margin: 0 0 32px 0; font-size: 16px; line-height: 1.5;">
            Thank you for creating an account with AND Offer. To complete your registration and start exploring products from verified Chinese suppliers, please verify your email address using the code below:
          </p>
          
          <!-- OTP Code -->
          <div style="background-color: #f8fafc; border: 2px dashed #0B1F3A; border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0;">
            <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
              Your verification code
            </p>
            <div style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; color: #0B1F3A; letter-spacing: 4px; margin: 0;">
              ${otpCode}
            </div>
            <p style="color: #64748b; margin: 16px 0 0 0; font-size: 14px;">
              This code will expire in 15 minutes
            </p>
          </div>
          
          <p style="color: #374151; margin: 0 0 32px 0; font-size: 16px; line-height: 1.5;">
            If you didn't create an account with us, you can safely ignore this email.
          </p>
          
          <!-- Security Notice -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 32px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.4;">
              <strong>Security tip:</strong> Never share this verification code with anyone. AND Offer will never ask for your code via phone or email.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">
            Need help? Contact our support team at support@offer.andgroupco.com
          </p>
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            © ${new Date().getFullYear()} A.N.D. GROUP OF COMPANIES LLC. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `
Verify your AND Offer account

Hi ${name},

Thank you for creating an account with AND Offer. To complete your registration and start exploring products from verified Chinese suppliers, please verify your email address using the code below:

Your verification code: ${otpCode}

This code will expire in 15 minutes.

If you didn't create an account with us, you can safely ignore this email.

Security tip: Never share this verification code with anyone. AND Offer will never ask for your code via phone or email.

Need help? Contact our support team at support@offer.andgroupco.com

© ${new Date().getFullYear()} A.N.D. GROUP OF COMPANIES LLC. All rights reserved.
    `.trim(),
  };
}

export function getWelcomeEmailTemplate(name: string): EmailTemplate {
  return {
    subject: "Welcome to AND Offer - Your account is now active!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0B1F3A 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">AND Offer</h1>
          <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px;">A.N.D. GROUP OF COMPANIES LLC</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #0B1F3A; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">
            Welcome to AND Offer, ${name}! 🎉
          </h2>
          
          <p style="color: #374151; margin: 0 0 24px 0; font-size: 16px; line-height: 1.5;">
            Congratulations! Your email has been verified and your account is now active. You can now access all features of our platform.
          </p>
          
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 32px 0;">
            <h3 style="color: #166534; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">
              What you can do now:
            </h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Browse thousands of products from verified Chinese suppliers</li>
              <li>Submit inquiries directly to suppliers</li>
              <li>Manage your product interests and supplier connections</li>
              <li>Access exclusive deals and bulk pricing options</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://offer.andgroupco.com/auth/signin" style="display: inline-block; background-color: #0B1F3A; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Sign In to Your Account
            </a>
          </div>
          
          <p style="color: #374151; margin: 24px 0 0 0; font-size: 16px; line-height: 1.5;">
            If you have any questions or need assistance, our support team is here to help.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">
            Need help? Contact our support team at support@offer.andgroupco.com
          </p>
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            © ${new Date().getFullYear()} A.N.D. GROUP OF COMPANIES LLC. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `
Welcome to AND Offer, ${name}!

Congratulations! Your email has been verified and your account is now active. You can now access all features of our platform.

What you can do now:
- Browse thousands of products from verified Chinese suppliers
- Submit inquiries directly to suppliers
- Manage your product interests and supplier connections
- Access exclusive deals and bulk pricing options

Sign in to your account: https://offer.andgroupco.com/auth/signin

If you have any questions or need assistance, our support team is here to help.

Need help? Contact our support team at support@offer.andgroupco.com

© ${new Date().getFullYear()} A.N.D. GROUP OF COMPANIES LLC. All rights reserved.
    `.trim(),
  };
}
