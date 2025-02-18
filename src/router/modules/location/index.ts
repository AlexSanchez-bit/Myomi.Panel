export const locationRoutes = [
  {
    path: "locations",
    name: "locations",
    component: () => import("@/pages/locations/index.vue"),
  },

  {
    path: "locations/create",
    name: "locations.create",
    component: () => import("@/components/Location/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "locations/:id/edit",
    name: "locations.edit",
    component: () => import("@/components/Location/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      location_id: route.params.id,
    }),
  },
];
