import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponse {
  id: string;
  name: string;
  email: string;
}

async function signIn(values: SignInPayload) {
  return await axiosInstance.post<SignInResponse>("/auth/login", values);
}

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
  });
}
