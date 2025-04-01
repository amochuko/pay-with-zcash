'use server'
import bcrypt from "bcryptjs";
import { SignupFormSchema, SignupFormState } from "../lib/typings";
import authService from "../lib/service/auth.service";

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

  console.log({ email, name, password, hashedPassword });

  const result = await authService.signUp({ email, name, hashedPassword });
  const user = result?.row;

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };

    // TODO:
    // Create user session
    // Redirect user
  }
}
