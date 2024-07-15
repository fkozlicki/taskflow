import {createRouter, createWebHistory} from "vue-router";
import {routes} from "./routes.ts";
import {useUser} from "@/store/user.ts";

export const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, _from, next) => {
    const userStore = useUser()

    if (userStore.status === 'loading') {
        await userStore.getSession()
    }

    if (!userStore.user && !['/sign-up', '/sign-in', '/', '/verify'].includes(to.path)) {
        next({path: '/sign-in'})
    } else if (userStore.user && ['/sign-up', '/sign-in', '/'].includes(to.path)) {
        next({path: '/dashboard'})
    } else {
        next()
    }
})