import { z } from "zod";

export const sendEmailSchema = z
  .object({
    to: z.union([z.string().email(), z.array(z.string().email()).min(1)]),
    from: z.string().email().optional(),
    subject: z.string().min(1).max(998),
    body: z.string().min(1).optional(),
    template: z.string().min(1).max(100).optional(),
    templateData: z.record(z.unknown()).optional(),
    cc: z.array(z.string().email()).max(50).optional(),
    bcc: z.array(z.string().email()).max(50).optional(),
    replyTo: z.string().email().optional(),
  })
  .refine((data) => data.body || data.template, {
    message: "Either body or template must be provided",
    path: ["body"],
  });

export type SendEmailInput = z.infer<typeof sendEmailSchema>;

export const sendEmailFullSchema = z
  .object({
    to: z.union([z.string().email(), z.array(z.string().email()).min(1)]),
    from: z.string().email().optional(),
    subject: z.string().min(1).max(998),
    html: z.string().optional(),
    text: z.string().optional(),
    template: z.string().max(100).optional(),
    data: z.record(z.unknown()).optional(),
    cc: z.array(z.string().email()).max(50).optional(),
    bcc: z.array(z.string().email()).max(50).optional(),
    replyTo: z.string().email().optional(),
    attachments: z
      .array(
        z.object({
          filename: z.string().min(1).max(255),
          content: z.string().min(1),
          contentType: z.string().optional(),
        }),
      )
      .max(10)
      .optional(),
    headers: z.record(z.string()).optional(),
    tags: z.array(z.string().min(1)).max(10).optional(),
    scheduledAt: z.date().optional(),
    idempotencyKey: z.string().min(1).optional(),
  })
  .refine((data) => data.html || data.text || data.template, {
    message: "Provide html, text, or template",
    path: ["html"],
  });

export type SendEmailFullInput = z.infer<typeof sendEmailFullSchema>;
