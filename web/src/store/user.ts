import {defineStore} from "pinia";
import {ref} from "vue";
import {get, post} from "@/lib/axios.ts";
import {toast} from "vue-sonner";
import {useRouter} from "vue-router";

export interface User {
    id: string;
    name: string;
    email: string;
}

interface SignInPayload {
    email: string;
    password: string;
}

interface SignUpPayload extends SignInPayload {
    name: string;
}

export const useUser = defineStore('user', () => {
    const user = ref<User | null>(null);
    const router = useRouter()
    const status = ref('loading')

    const signIn = async (values: SignInPayload) => {
        try {
            user.value = await post('/users/login', values)
            status.value = 'authenticated'
            toast.success('Sign in successful')
            await router.push({name: 'Dashboard'})
        } catch (error) {
            console.error(error)
            toast.error("Couldn't sign in. Try again")
        }
    }

    const useSignUp = async (values: SignUpPayload) => {
        try {
            await post('/users/register', values)
            toast("Successfully registered")
        } catch (error) {
            console.error(error)
            toast("Couldn't register. Try again")
        }
    }
    const getSession = async () => {
        const data = await get('/users/session');

        if (data) {
            user.value = data
            status.value = 'authenticated'
        } else {
            status.value = 'unauthenticated'
        }
    }

    return {user, useSignUp, signIn, getSession, status}
})