export const productsRoutes = [
  {
    path: "products",
    name: "products",
    component: () => import("@/pages/products/index.vue"),
  },
  {
    path: "products/create",
    name: "products.create",
    component: () => import("@/components/Shop/Products/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "products/:id/edit",
    name: "products.edit",
    component: () => import("@/components/Shop/Products/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      product_id: route.params.id,
    }),
  },
];
