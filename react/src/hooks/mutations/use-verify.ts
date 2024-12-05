import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

const verify = async (code: string) => {
  return await api.post(`/auth/verify?code=${code}`, {});
};

export function useVerify() {
  return useMutation({
    mutationFn: verify,
  });
}
