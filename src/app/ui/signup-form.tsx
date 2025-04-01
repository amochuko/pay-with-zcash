'use client'
import { useActionState } from "react";
import { signUp } from "../actions";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, undefined);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          disabled={pending}
        />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          disabled={pending}
        />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="text"
          id="password"
          name="password"
          placeholder="Password"
          disabled={pending}
        />
      </div>

      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((err, i) => (
              <li key={err + "_" + i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      <button type="submit" disabled={pending}>
        Sign Up
      </button>
    </form>
  );
}
