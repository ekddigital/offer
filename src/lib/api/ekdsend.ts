import { env } from "@/lib/env";
import { sendEmailFullSchema, sendEmailSchema } from "@/lib/validation/email";

const EKDSEND_BASE_URL = "https://es.ekddigital.com/api/v1";

export async function sendTransactionalEmail(input: unknown) {
  const payload = sendEmailSchema.parse(input);

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

  const response = await fetch(`${EKDSEND_BASE_URL}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ANDOFFER_MAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      from: payload.from ?? env.ANDOFFER_DEFAULT_FROM,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email API error: ${response.status}`);
  }

  return response.json();
}
