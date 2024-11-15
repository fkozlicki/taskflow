import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";
import { ProjectDetails } from "@/hooks/queries/use-project.ts";

type JoinParams = { code: string } | { token: string };

const joinProject = async (params: JoinParams) => {
  const q = "code" in params ? `code=${params.code}` : `token=${params.token}`;

  return (await axiosInstance.post<ProjectDetails>(`/projects/join?${q}`)).data;
};

export function useJoinProject() {
  return useMutation({
    mutationFn: joinProject,
  });
}
