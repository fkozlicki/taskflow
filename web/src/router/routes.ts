import Home from "../pages/Home.vue";
import SignIn from "@/pages/SignIn.vue";
import SignUp from "@/pages/SignUp.vue";
import Verify from "@/pages/Verify.vue";
import Dashboard from "@/pages/Dashboard.vue";
import {RouteRecordRaw} from "vue-router";
import Header from "@/components/Header.vue";
import SignUpSuccess from "@/pages/SignUpSuccess.vue";

export const routes: RouteRecordRaw[] = [
    {
        path: '',
        components: {
            Header
        },
        children: [
            {path: '/', component: Home, name: 'Home'},
            {path: '/dashboard', component: Dashboard, name: "Dashboard", meta: {requireAuth: true}},
        ]
    },
    {path: '/sign-in', component: SignIn, name: "SignIn", meta: {requireGuest: true}},
    {path: '/sign-up', component: SignUp, name: "SignUp", meta: {requireGuest: true}},
    {path: '/sign-up-success', component: SignUpSuccess, name: "SignUpSuccess", meta: {requireRedirect: true, requireGuest: true}},
    {path: '/verify', component: Verify, name: "Verify", meta: {requireGuest: true}},
]