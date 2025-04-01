import bcrypt from "bcryptjs";
import authService from "../lib/service/auth.service";
import { SignupFormSchema, SignupFormState } from "../lib/typings";

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

  console.log(validatedFields);
  // TODO: provider service

  const { email, name, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await authService.signUp({ email, name, hashedPassword });
  const user = result?.rows[0];

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };

    // TODO:
    // Create user session
    // Redirect user
  }
}
