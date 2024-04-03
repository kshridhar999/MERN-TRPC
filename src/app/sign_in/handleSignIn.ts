"use server";

import { cookies } from "next/headers";
import { signInSchema } from "~/input_types";
import { api } from "~/trpc/server";

export default async function onSignIn(formData: FormData) {
  const validated = signInSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!validated.success) {
    return { error: validated.error.issues.join("\n") };
  }
  try {
    const res = await api.auth.signIn(validated.data);

    if (res.token) {
      cookies().set("sid", res.token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 365,
      });
      return { isEmailVerified: true };
    }

    return { isEmailVerified: false, id: res.id };
  } catch (e) {
    return { error: e };
  }
}
