import {createRouter, createWebHistory} from "vue-router";
import {routes} from "./routes.ts";
import {useUser} from "@/store/user.ts";

export const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const userStore = useUser()

    if (userStore.status === 'loading') {
        await userStore.getSession()
    }

    if (to.meta.requireAuth && !userStore.user) {
        next({name: 'SignIn'})
    } else if (to.meta.requireGuest && userStore.user) {
        next({name: 'Dashboard'})
    } else if (to.meta.requireRedirect && from.name !== 'SignUp') {
        next({name: 'Home'})
    } else {
        next()
    }
})