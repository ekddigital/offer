import { env } from "@/lib/env";
import { sendEmailFullSchema, sendEmailSchema } from "@/lib/validation/email";

const EKDSEND_BASE_URL = "https://es.ekddigital.com/api/v1";

export async function sendTransactionalEmail(input: unknown) {
  const payload = sendEmailSchema.parse(input);

  // Check if we're using a placeholder API key
  if (!env.ANDOFFER_MAIL_API_KEY || env.ANDOFFER_MAIL_API_KEY === "ek_build_placeholder") {
    console.error("❌ EKDSend API key is not properly configured (using placeholder or missing)");
    throw new Error("Email service is not configured. Please configure ANDOFFER_MAIL_API_KEY.");
  }

  const response = await fetch(`${EKDSEND_BASE_URL}/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ANDOFFER_MAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "email",
      ...payload,
      from: payload.from ?? env.ANDOFFER_DEFAULT_FROM,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email API error: ${response.status}`);
  }

  return response.json();
}

export async function sendEmailAdvanced(input: unknown) {
  const payload = sendEmailFullSchema.parse(input);

  // Check if we're using a placeholder API key
  if (!env.ANDOFFER_MAIL_API_KEY || env.ANDOFFER_MAIL_API_KEY === "ek_build_placeholder") {
    console.error("❌ EKDSend API key is not properly configured (using placeholder or missing)");
    throw new Error("Email service is not configured. Please configure ANDOFFER_MAIL_API_KEY.");
  }

  const emailPayload = {
    ...payload,
    from: payload.from ?? env.ANDOFFER_DEFAULT_FROM,
  };

  console.log("🚀 EKDSend API Request:", {
    url: `${EKDSEND_BASE_URL}/emails`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ANDOFFER_MAIL_API_KEY?.substring(0, 10)}...`,
      "Content-Type": "application/json",
    },
    payload: {
      to: emailPayload.to,
      from: emailPayload.from,
      subject: emailPayload.subject,
      hasHtml: !!emailPayload.html,
      hasText: !!emailPayload.text,
    },
  });

  const response = await fetch(`${EKDSEND_BASE_URL}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ANDOFFER_MAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  console.log("📨 EKDSend API Response:", {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ EKDSend API Error Response:", errorText);
    throw new Error(`Email API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("✅ EKDSend API Success:", result);

  return result;
}

/**
 * Get sandbox emails for testing
 */
export async function getSandboxEmails(limit: number = 10) {
  const response = await fetch(
    `${EKDSEND_BASE_URL}/sandbox/emails?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${env.ANDOFFER_MAIL_API_KEY}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Sandbox API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Clear all sandbox emails
 */
export async function clearSandboxEmails() {
  const response = await fetch(`${EKDSEND_BASE_URL}/sandbox/emails/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${env.ANDOFFER_MAIL_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Clear sandbox API error: ${response.status}`);
  }

  return response.json();
}
