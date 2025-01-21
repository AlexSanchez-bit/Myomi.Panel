import { categoryRoutes } from "./categories";
import { materialRoutes } from "./materials";

import { productsRoutes } from "./products";

export const shopRoutes = [
  ...categoryRoutes,
  ...materialRoutes,
  ...productsRoutes,
];
