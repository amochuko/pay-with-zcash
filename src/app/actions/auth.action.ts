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
  const validatedFields = SignupFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, name, password } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await authService.signUp({ email, name, hashedPassword });
    const user = result;

    if (!user) {
      return {
        message:
          "An error occurred while creating your account. Please try again.",
      };
    }

    console.log("SignUp was successful");
  } catch (err) {
    if (err instanceof Error) {
      // Log the error for internal use (be cautious of exposing it)
      console.error("SignUp Error:", err.message);

      // Optionally, show specific messages based on the error type
      if (err.message.includes("email address is too long")) {
        return {
          message:
            "The email address you provided is too long. Please check and try again.",
        };
      }

      // Display a generic error message to the user
      return {
        message: "There was a problem creating your account. Please try again.",
      };
    } else {
      console.error("An unexpected error occurred:", err);
      return {
        message: "An unexpected error occurred. Please try again later.",
      };
    }
  }

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
    } else if (user && confirmPassword && user.role != "admin") {
      return {
        errors: {
          email: ["You are not authorized"],
        },
      };
    }
    // add user_id to session
    await createUserSession(user.user_id);
  } catch (err) {
    console.error(err);

    throw err;
  }
  redirect("/dashboard");
}

export async function logOut() {
  try {
    await deleteUserSession();
  } catch (err) {
    console.error(err);
  }
  redirect("/");
}
