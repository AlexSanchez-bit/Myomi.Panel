export const categoryRoutes = [
  {
    path: "categories",
    name: "categories",
    component: () => import("@/pages/categories/index.vue"),
  },
  {
    path: "categories/create",
    name: "categories.create",
    component: () => import("@/components/Shop/Categories/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
];
