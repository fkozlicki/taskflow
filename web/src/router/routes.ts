import Home from "../pages/Home.vue";
import SignIn from "@/pages/SignIn.vue";
import SignUp from "@/pages/SignUp.vue";
import Verify from "@/pages/Verify.vue";
import Dashboard from "@/pages/Dashboard.vue";
import {RouteRecordRaw} from "vue-router";
import Header from "@/components/Header.vue";

export const routes: RouteRecordRaw[] = [
    {
        path: '',
        components: {
            Header
        },
        children: [
            {path: '/', component: Home, name: 'Home'},
            {path: '/verify', component: Verify, name: "Verify"},
            {path: '/dashboard', component: Dashboard, name: "Dashboard"},
        ]
    },
    {path: '/sign-in', component: SignIn, name: "SignIn"},
    {path: '/sign-up', component: SignUp, name: "SignUp"},
]