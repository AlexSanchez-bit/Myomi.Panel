export const currencyRoutes = [
  {
    path: "currencies",
    name: "currencies",
    component: () => import("@/pages/currencies/index.vue"),
  },
  {
    path: "currencies/create",
    name: "currencies.create",
    component: () => import("@/components/Currency/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "currencies/:id/edit",
    name: "currencies.edit",
    component: () => import("@/components/Currency/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      currency_id: route.params.id,
    }),
  },
];
