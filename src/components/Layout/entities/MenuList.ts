import { Permission } from "@/utils/Permissions";
import { GroupMenuType } from "./GroupMenu";
import { type MenuListItem } from "./MenuListItem";
export const MenuList: MenuListItem[] = [
  {
    name: "Administrative",
    icon: "",
    router_direction: "",
    type: GroupMenuType.Static,
    childrenMenu: [
      {
        name: "users",
        icon: "pi pi-user",
        router_direction: "/users",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_USER],
      },
      {
        name: "currencies",
        icon: "pi pi-money-bill",
        router_direction: "/currencies",
        type: GroupMenuType.Normal,
        permission: [],
      },
      {
        name: "payment_types",
        icon: "pi pi-money-bill",
        router_direction: "/payment-types",
        type: GroupMenuType.Normal,
        permission: [],
      },
    ],
  },
  {
    name: "Shop",
    icon: "",
    router_direction: "",
    type: GroupMenuType.Static,
    childrenMenu: [
      {
        name: "categories",
        icon: "pi pi-tags",
        router_direction: "/categories",
        type: GroupMenuType.Normal,
        permission: [],
      },
      {
        name: "material",
        icon: "pi pi-receipt",
        router_direction: "/materials",
        type: GroupMenuType.Normal,
        permission: [],
      },
      {
        name: "concerns",
        icon: "pi pi-tags",
        router_direction: "/concerns",
        type: GroupMenuType.Normal,
        permission: [],
      },
      {
        name: "brands",
        icon: "pi pi-tags",
        router_direction: "/brands",
        type: GroupMenuType.Normal,
        permission: [],
      },
      {
        name: "products",
        icon: "pi pi-shopping-bag",
        router_direction: "/products",
        type: GroupMenuType.Normal,
        permission: [],
      },
      {
        name: "orders",
        icon: "pi pi-shopping-cart",
        router_direction: "/orders",
        type: GroupMenuType.Normal,
        permission: [Permission.READ_ORDER],
      },
    ],
  },
  {
    name: "General",
    icon: "",
    router_direction: "",
    type: GroupMenuType.Static,
    childrenMenu: [
      {
        name: "general_configs",
        icon: "pi pi-tags",
        router_direction: "/general-configs",
        type: GroupMenuType.Normal,
      },
      {
        name: "locations",
        icon: "pi pi-map-marker",
        router_direction: "/locations",
        type: GroupMenuType.Normal,
      },
    ],
  },
];
