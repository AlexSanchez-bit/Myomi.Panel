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
      },
      {
        name: "currencies",
        icon: "pi pi-money-bill",
        router_direction: "/currencies",
        type: GroupMenuType.Normal,
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
      },
      {
        name: "material",
        icon: "pi pi-receipt",
        router_direction: "/materials",
        type: GroupMenuType.Normal,
      },
      {
        name: "products",
        icon: "pi pi-shopping-bag",
        router_direction: "/products",
        type: GroupMenuType.Normal,
      },
    ],
  },
];
