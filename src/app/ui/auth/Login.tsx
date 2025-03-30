'use client'

import { signIn } from "../../../../auth";


export default function Login() {
  const login = async () => {
    await signIn();
  };

  return (
    <form action={login}>
      <button type="submit">Sigin with GitHub</button>
    </form>
  );
}
