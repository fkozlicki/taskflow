import Home from "../pages/Home.vue";
import SignIn from "@/pages/SignIn.vue";
import SignUp from "@/pages/SignUp.vue";
import Verify from "@/pages/Verify.vue";
import {RouteRecordRaw} from "vue-router";
import SignUpSuccess from "@/pages/SignUpSuccess.vue";
import LayoutWithHeader from "@/components/ProjectLayout.vue";
import Chat from "@/pages/Chat.vue";
import Projects from "@/pages/Projects.vue";
import Project from "@/pages/Project.vue";
import Tasks from "@/pages/Tasks.vue";

export const routes: RouteRecordRaw[] = [
    {
        path: '/projects',
        meta: {requireAuth: true},
        children: [
            { path: '', component: Projects, name: "Projects"},
            { path: ':id', component: LayoutWithHeader, children: [
                    {path: '', component: Project, name: 'Project'},
                    {path: 'chat', component: Chat, name: 'Chat'},
                    {path: 'tasks', component: Tasks, name: 'Tasks'}
                ]}
        ]
    },
    {path: '/', component: Home, name: 'Home'},
    {path: '/sign-in', component: SignIn, name: "SignIn", meta: {requireGuest: true}},
    {path: '/sign-up', component: SignUp, name: "SignUp", meta: {requireGuest: true}},
    {
        path: '/sign-up-success',
        component: SignUpSuccess,
        name: "SignUpSuccess",
        meta: {requireRedirect: true, requireGuest: true}
    },
    {path: '/verify', component: Verify, name: "Verify", meta: {requireGuest: true}},
]