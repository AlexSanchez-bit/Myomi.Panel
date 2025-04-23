import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../components/Layout/components/MainLayout.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useSplashStore } from "@/stores/SplashScreen";
import { userRoutes } from "./modules/user";
import { shopRoutes } from "./modules/shop";
import { currencyRoutes } from "./modules/currency";
import { brandRoutes } from "./modules/shop/brands";
import { generalConfigsRoutes } from "./modules/general-configs";
import { locationRoutes } from "./modules/location";
import { paymentTypesRoutes } from "./modules/payment-types";
import { orderRoutes } from "./modules/orders";

const router = createRouter({
  history: createWebHistory("#"),
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
        ...userRoutes,
        ...shopRoutes,
        ...currencyRoutes,
        ...brandRoutes,
        ...generalConfigsRoutes,
        ...locationRoutes,
        ...paymentTypesRoutes,
        ...orderRoutes,
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/Auth/Login.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("@/pages/404.vue"),
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
