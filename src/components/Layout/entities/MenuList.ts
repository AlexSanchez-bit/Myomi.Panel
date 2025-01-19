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
        name: "Users",
        icon: "pi pi-user",
        router_direction: "/users",
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
        icon: "pi pi-ticket",
        router_direction: "/categories",
        type: GroupMenuType.Normal,
      },
      {
        name: "material",
        icon: "pi pi-wrench",
        router_direction: "/materials",
        type: GroupMenuType.Normal,
      },
    ],
  },
];
