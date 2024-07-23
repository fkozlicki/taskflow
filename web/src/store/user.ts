import {defineStore} from "pinia";
import {ref} from "vue";
import {get, post} from "@/lib/axios.ts";
import {toast} from "vue-sonner";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";

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

// const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useUser = defineStore('user', () => {
    const user = ref<User | null>(null);
    const router = useRouter()
    const route = useRoute()
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

    const signUp = async (values: SignUpPayload) => {
        try {
            await post('/users/register', values)
            await router.push({name: 'SignUpSuccess'})
            toast.success("Successfully signed up")
        } catch (error) {
            console.error(error)
            toast.error("Couldn't register. Try again")
        }
    }

    const googleSignIn = async () => {
        const endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

        const form = document.createElement('form');

        form.setAttribute('method', 'GET')
        form.setAttribute('action', endpoint);

        const params = {
            client_id: '19915044324-odfrflr1ghroukhb62fqkcsv95aiuchd.apps.googleusercontent.com',
            redirect_uri: 'http://localhost:8080/login/oauth2/code/google',
            scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
            response_type: 'token'
        };

        for (const p in params) {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    }

    const githubSignIn = () => {

        const params = {
            client_id: 'Ov23liuYZtcShVDy6ocV',
            redirect_uri: 'http://localhost:8080/login/oauth2/code/github',
            scope: 'user'
        }

        const enpoint = `https://github.com/login/oauth/authorize?client_id=${params.client_id}&redirect_uri=${params.redirect_uri}`

        window.location.href = enpoint
    }

    const getSession = async () => {
        try {
            const data = await get('/users/session');

            if (data) {
                user.value = data
                status.value = 'authenticated'
            } else {
                status.value = 'unauthenticated'
            }
        } catch (error) {
            console.error(error)
        }
    }

    const verify = async () => {
        try {
            await get('/users/verify', {params: {code: route.query.code}})
            return 'success'
        } catch (error) {
            console.error(error)
            return 'error'
        }
    }

    return {user, signIn, signUp, googleSignIn, githubSignIn, getSession, verify, status}
})