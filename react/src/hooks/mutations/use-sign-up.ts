import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

interface SignUpPayload {
  email: string;
  password: string;
}

async function signUp(values: SignUpPayload) {
  return await axiosInstance.post("/users/register", values);
}

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}
