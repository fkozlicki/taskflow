import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";

const verify = async (code: string) => {
  return await axiosInstance.post(`/users/verify?code=${code}`);
};

export function useVerify() {
  return useMutation({
    mutationFn: verify,
  });
}
