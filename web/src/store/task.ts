import {defineStore} from "pinia";
import {ref} from "vue";
import {get, post} from "@/lib/axios.ts";
import {useRoute} from "vue-router";
import {toast} from "vue-sonner";

interface Task {
    status: string;
    modalOpen: boolean;
}

export const useTask = defineStore('task', () => {
    const status = ref<string|null>(null)
    const modalOpen = ref<boolean>(false)
    const tasks = ref()
    const route = useRoute()

    const changeStatus = (newStatus: string) => {
        status.value = newStatus;
    }

    const toggleModalOpen = (value: boolean) => {
        modalOpen.value = value;
    }

    const getProjectTasks = async () => {
        try {
            tasks.value = await get(`/projects/${route.params.id}/tasks`)
        } catch (err) {
            console.error(err)
        }
    }

    const createTask = async (values) => {
        try {
            const res = await post("/tasks", values)
            console.log(res)
            toast.success("Created task")
        } catch (err) {
            console.error(err)
        }
    }

    return {
        status,
        modalOpen,
        changeStatus,
        toggleModalOpen,
        getProjectTasks,
        tasks,
        createTask
    }
})