import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

interface SignUpPayload {
  email: string;
  password: string;
}

async function signUp(values: SignUpPayload) {
  return await api.post("/auth/register", values);
}

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}
