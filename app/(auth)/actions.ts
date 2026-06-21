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

  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
    headers: currentHeaders
  });

  if (response.status !== 200) {
      const data = await response.json();
      return { error: data.message || "An error occurred during login." };
  }

  redirect("/");
}

export async function signupAction(data: SignupInput) {
  const result = signupSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data provided." };
  }

  const { email, password, name } = result.data;
  const currentHeaders = await headers();

  const response = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
    asResponse: true,
    headers: currentHeaders
  });

  if (response.status !== 200) {
      const data = await response.json();
      return { error: data.message || "An error occurred during signup." };
  }

  redirect("/");
}
