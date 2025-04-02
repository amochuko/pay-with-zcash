"use server";
import { signIn, signOut } from "@/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import authService from "../lib/service/auth.service";
import {
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
  const validatedFields = SignupFormSchema.omit({ name: true }).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { email, password } = validatedFields.data;
    console.log({ email, password });

    // const user = await authService.findUserByEmail(email);

    // if (!user) {
    //   return {
    //     message: "An error occurred with the login process",
    //   };
    // }
    // const confirmPassword = await bcrypt.compare(
    //   password,
    //   String(user.password)
    // );

    // console.log({ confirmPassword });

    // return user;
  } catch (err) {
    console.error(err);

    throw err;
  }
}

export async function login() {
  try {
    await signIn("github", {
      redirect: "/dashboard",
    });
  } catch (err) {
    console.error(err);
  }
}

export async function logout(authType: string, formData: FormData) {
  console.log({ authType, formData });
  try {
    await signOut();
  } catch (err) {
    console.error(err);
  }
}
