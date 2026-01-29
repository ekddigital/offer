import { env } from "@/lib/env";
import { sendEmailFullSchema, sendEmailSchema } from "@/lib/validation/email";

export async function sendTransactionalEmail(input: unknown) {
  const payload = sendEmailSchema.parse(input);

  const response = await fetch(`${env.EKDSEND_BASE_URL}/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.EKDSEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "email",
      ...payload,
      from: payload.from ?? env.EKDSEND_DEFAULT_FROM,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email API error: ${response.status}`);
  }

  return response.json();
}

export async function sendEmailAdvanced(input: unknown) {
  const payload = sendEmailFullSchema.parse(input);

  const response = await fetch(`${env.EKDSEND_BASE_URL}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.EKDSEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      from: payload.from ?? env.EKDSEND_DEFAULT_FROM,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email API error: ${response.status}`);
  }

  return response.json();
}
