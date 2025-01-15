import { GroupMenuType } from "./GroupMenu";
import { type MenuListItem } from "./MenuListItem";

export const MenuList: MenuListItem[] = [
  {
    name: "Principal",
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
      {
        name: "Newsletter",
        icon: "pi pi-envelope",
        router_direction: "/newsletter",
        type: GroupMenuType.Normal,
      },
    ],
  },
];
