export const materialRoutes = [
  {
    path: "materials",
    name: "materials",
    component: () => import("@/pages/materials/index.vue"),
  },
  {
    path: "materials/create",
    name: "materials.create",
    component: () => import("@/components/Shop/Materials/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "materials/:id/edit",
    name: "materials.edit",
    component: () => import("@/components/Shop/Materials/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      material_id: route.params.id,
    }),
  },
];
