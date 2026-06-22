"use server";

import { auth } from "@/lib/auth";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function loginAction(data: LoginInput) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data provided." };
  }

  const { email, password } = result.data;
  const currentHeaders = await headers();

  try {
      await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        headers: currentHeaders
      });
  } catch (err: any) {
    const detailedError = err.body?.message || err.message || "An error occurred during login.";
    return {
      error: process.env.NODE_ENV === "development"
        ? detailedError
        : "An error occurred during login."
    };
  }

  redirect("/");
}

export async function signupAction(data: SignupInput) {
  const result = signupSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data provided." };
  }

  const { email, password, name, phoneNumber } = result.data;
  const currentHeaders = await headers();

  try {
      await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
          phoneNumber: phoneNumber || undefined,
        },
        headers: currentHeaders
      });
  } catch (err: any) {
    const detailedError = err.body?.message || err.message || "An error occurred during signup.";
    return {
      error: process.env.NODE_ENV === "development"
        ? detailedError
        : "An error occurred during signup."
    };
  }

  redirect("/");
}
