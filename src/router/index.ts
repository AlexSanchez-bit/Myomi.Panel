import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../components/Layout/components/MainLayout.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useSplashStore } from "@/stores/SplashScreen";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "default",
          component: () => import("@/components/Default/Default.vue"),
        },
        {
          path: "newsletter",
          name: "newsletter",
          component: () =>
            import("@/views/Newsletter/NewsLetterSubscriptions.vue"),
        },
        {
          path: "users",
          name: "users",
          component: () => import("@/views/Users/Users.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Auth/Login.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const { enable } = useSplashStore();
  enable();
  if (!authStore.authenticated && to.name != "login") {
    next("login");
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  const { disable } = useSplashStore();
  disable();
});

export default router;
