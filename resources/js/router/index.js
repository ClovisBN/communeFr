import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home.vue";
// import Login from "@/views/Login.vue";
// import Signup from "@/views/Signup.vue";

// import Nouvelles from "@/views/public/Nouvelles.vue";
// import Profile from "@/views/public/Profile.vue";
// import Sondage from "@/views/public/SondageUser.vue";

// import NouvellesCrud from "@/views/admin/NouvellesCrud.vue";
// import UserCrud from "@/views/admin/UserCrud.vue";
// import SondageAdd from "@/views/admin/SondageAdd.vue";
import formBuilder from "../components/admin/FormBuilder.vue";
import adminLayout from "../components/admin/Layout.vue";
// import { authGuardPublic, authGuardAdmin } from "@/_helpers/auth-guard";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    // {
    //     path: "/login",
    //     name: "Login",
    //     component: Login,
    // },
    // {
    //     path: "/signup",
    //     name: "Signup",
    //     component: Signup,
    // },
    // {
    //     path: "/public",
    //     name: "public",
    //     component: publicLayout,
    //     children: [
    //         {
    //             path: "nouvelles",
    //             name: "Nouvelles",
    //             component: Nouvelles,
    //             meta: { requiresAuth: true },
    //         },
    //         {
    //             path: "profile",
    //             name: "Profile",
    //             component: Profile,
    //             meta: { requiresAuth: true },
    //         },
    //         {
    //             path: "sondage",
    //             name: "Sondage",
    //             component: Sondage,
    //             meta: { requiresAuth: true },
    //         },
    //     ],
    // },
    {
        path: "/admin",
        name: "admin",
        component: adminLayout,
        children: [
            // {
            //     path: "sondageadd",
            //     name: "SondageAdd",
            //     component: SondageAdd,
            //     meta: { requiresAuth: true, requiresAdmin: true },
            // },
            // {
            //     path: "nouvellescrud",
            //     name: "NouvellesCrud",
            //     component: NouvellesCrud,
            //     meta: { requiresAuth: true, requiresAdmin: true },
            // },
            // {
            //     path: "usercrud",
            //     name: "UserCrud",
            //     component: UserCrud,
            //     meta: { requiresAuth: true, requiresAdmin: true },
            // },
            {
                path: "form",
                name: "form",
                component: formBuilder,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
