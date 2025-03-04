export const orderRoutes = [
  {
    path: "orders",
    name: "orders",
    component: () => import("@/pages/orders/index.vue"),
  },

  {
    path: "orders/create",
    name: "orders.create",
    component: () => import("@/components/Orders/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "orders/:id/edit",
    name: "orders.edit",
    component: () => import("@/components/Orders/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      order_id: route.params.id,
    }),
  },
];
