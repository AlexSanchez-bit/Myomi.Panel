export const concernRoutes = [
  {
    path: "concerns",
    name: "concerns",
    component: () => import("@/pages/concerns/index.vue"),
  },
  {
    path: "concerns/create",
    name: "concerns.create",
    component: () => import("@/components/Shop/Concerns/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "concern/:id/edit",
    name: "concerns.edit",
    component: () => import("@/components/Shop/Concerns/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      concern_id: route.params.id,
    }),
  },
];
