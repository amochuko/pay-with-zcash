"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import logger from "../lib/logger";
import authService from "../lib/repo/auth.repo";
import { createUserSession, deleteUserSession } from "../lib/session";
import { LoginStateForm, SignupFormState } from "../lib/typings";
import { LoginFormSchema, SignupFormSchema } from "../lib/validation.schema";
import { revalidatePath } from "next/cache";

export async function signUp(state: SignupFormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse(
    Object.fromEntries(formData),
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
  } catch (err) {
    if (err instanceof Error) {
      // Log the error for internal use (be cautious of exposing it)
      logger.error("[SignUp Error]", err.message);

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
      logger.error("[SignUp Error]: An unexpected error occurred:", err);
      return {
        message: "An unexpected error occurred. Please try again later.",
      };
    }
  }

  redirect("/login");
}

export async function logIn(state: LoginStateForm, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  let redirectPath = "/dashboard";

  try {
    const result = await authService.findUserByEmail(
      validatedFields.data.email,
    );

    if (!result.success) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }

    const confirmPassword = await bcrypt.compare(
      validatedFields.data.password,
      String(result.data.password),
    );

    if (!confirmPassword) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }

    await createUserSession(result.data.user_id, result.data.role);

    if (result.data.role === "admin") {
      redirectPath = "/admin/dashboard";
    }
  } catch (err) {
    logger.error(`[logIn Error]`, err);

    return {
      errors: {
        email: ["Something went wrong. Please try again later"],
      },
    };
  }

  redirect(redirectPath);
}

export async function logOut() {
  try {
    await deleteUserSession();
  } catch (err) {
    logger.error(`[logOut]`, err);
  }
  redirect("/");
}
