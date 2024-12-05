import { useMutation } from "@tanstack/react-query";
import { ProjectDetails } from "@/hooks/queries/use-project.ts";
import { api } from "@/lib/api.ts";

type JoinParams = { code: string } | { token: string };

const joinProject = async (params: JoinParams) => {
  const q = "code" in params ? `code=${params.code}` : `token=${params.token}`;

  return await api.post<ProjectDetails>(`/projects/join?${q}`, {});
};

export function useJoinProject() {
  return useMutation({
    mutationFn: joinProject,
  });
}
