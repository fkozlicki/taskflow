import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";

interface User {
  id: string;
  name: string;
  email: string;
}

async function getSession() {
  return await api.get<User>("/auth/session");
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });
}
