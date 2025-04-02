"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import authService from "../lib/service/auth.service";
import { createUserSession, deleteUserSession } from "../lib/session";
import {
  LoginFormSchema,
  LoginStateForm,
  SignupFormSchema,
  SignupFormState,
} from "../lib/typings";

export async function signUp(state: SignupFormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, name, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await authService.signUp({ email, name, hashedPassword });
  const user = result;

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  // TODO:
  // Create user session
  // Redirect user

  console.log({ user });
  redirect("/login");
}

export async function logIn(state: LoginStateForm, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await authService.findUserByEmail(validatedFields.data.email);

    const confirmPassword = await bcrypt.compare(
      validatedFields.data.password,
      String(user.password)
    );

    if (!user || user.role != "admin" || !confirmPassword) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }

    // add user_id to session
    await createUserSession(user.user_id);

    redirect("/dashboard");
  } catch (err) {
    console.error(err);

    throw err;
  }
}

export async function logOut() {
  try {
    await deleteUserSession();

    redirect("/");
  } catch (err) {
    console.error(err);
  }
}
