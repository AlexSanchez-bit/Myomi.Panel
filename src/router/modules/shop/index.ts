import { categoryRoutes } from "./categories";
import { materialRoutes } from "./materials";

export const shopRoutes = [...categoryRoutes, ...materialRoutes];
