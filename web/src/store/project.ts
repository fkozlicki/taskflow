import {defineStore} from "pinia";
import {get, post} from "@/lib/axios.ts";
import {toast} from "vue-sonner";
import {ref} from "vue";

interface ProjectPayload {
    name: string;
}

interface Project {
    id: string;
    name: string;
}

export const useProject = defineStore('project', () => {
    const projects = ref([])


    const create = async (values: ProjectPayload) => {
        try {
            const res = await post('/projects', values)
            toast.error("Create new project")

            console.log(res);
        } catch (error) {
            toast.error("Couldn't create project")
        }
    }

    const getUserProjects = async () => {
        try {
            const data = await get("/projects")
            projects.value = data;

        } catch (error) {
            console.error(error)
        }
    }

    return {create, getUserProjects, projects}
})