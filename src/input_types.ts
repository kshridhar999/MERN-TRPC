import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1).max(30),
  email: z.string().email(),
  password: z.string().min(8).max(30),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const verifyEmailSchema = z
  .object({
    userId: z.string().optional(),
    vid: z.string().optional(),
    token: z.string().min(8).max(8),
  })
  .refine(
    (data) => data.userId ?? data.vid,
    "No user verification identifier provided.",
  );

export const resendVerfEmailSchema = z
  .object({
    userId: z.string().optional(),
    vid: z.string().optional(),
  })
  .refine(
    (data) => data.userId ?? data.vid,
    "No user verification identifier provided.",
  );

export const getAllInterestsSchema = z.object({
  filters: z
    .object({
      userId: z.string().optional(),
    })
    .optional(),
  pagination: z
    .object({
      page: z.number().optional(),
      limit: z.number().optional(),
    })
    .optional(),
});
