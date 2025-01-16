import { GroupMenuType } from "./GroupMenu";
import { type MenuListItem } from "./MenuListItem";

export const MenuList: MenuListItem[] = [
  {
    name: "Administrativo",
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
];
