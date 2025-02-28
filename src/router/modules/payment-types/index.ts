export const paymentTypesRoutes = [
  {
    path: "payment-types",
    name: "payment_types",
    component: () => import("@/pages/payment-types/index.vue"),
  },
  {
    path: "payment-types/create",
    name: "payment_types.create",
    component: () => import("@/components/PaymentTypes/CreateOrModify.vue"),
    props: {
      mode: "create",
    },
  },
  {
    path: "payment-types/:id/edit",
    name: "payment_types.edit",
    component: () => import("@/components/PaymentTypes/CreateOrModify.vue"),
    props: (route) => ({
      mode: "edit",
      paymentTypeId: route.params.id,
    }),
  },
];
