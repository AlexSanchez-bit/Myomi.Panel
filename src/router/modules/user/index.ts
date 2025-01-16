export const userRoutes = [
  {
    path: "users",
    name: "users",
    component: () => import("@/pages/users/index.vue"),
  },
  {
    path: "users/:id/edit",
    name: "users.edit",
    component: () => import("@/pages/users/[id].vue"),
    props: (route) => ({
      mode: "edit",
      user_id: route.params.id,
    }),
  },
  {
    path: "users/create",
    name: "users.create",
    component: () => import("@/pages/users/create.vue"),
    props: () => ({
      mode: "create",
    }),
  },
];
