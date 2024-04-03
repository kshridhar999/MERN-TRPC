"use server";

import { cookies } from "next/headers";
import { type z } from "zod";
import { type verifyEmailSchema } from "~/input_types";
import { api } from "~/trpc/server";

export default async function onVerify(
  verfData: z.infer<typeof verifyEmailSchema>,
) {
  try {
    const res = await api.auth.verifyEmail(verfData);

    if (res.token) {
      cookies().set("sid", res.token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 365,
      });
      return { isEmailVerified: true };
    }

    return { isEmailVerified: false };
  } catch (e) {
    return { error: e };
  }
}
