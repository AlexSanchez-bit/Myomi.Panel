export const brandRoutes = [
  {
    path: "brands",
    name: "brands",
    component: () => import("@/pages/brands/index.vue"),
  },
  {
    path: "brands/create",
    name: "brand.create",
    component: () => import("@/components/Shop/Brands/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "brands/:id/edit",
    name: "brands.edit",
    component: () => import("@/components/Shop/Brands/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      brand_id: route.params.id,
    }),
  },
];
