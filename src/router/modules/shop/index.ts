import { categoryRoutes } from "./categories";
import { concernRoutes } from "./concern";
import { materialRoutes } from "./materials";

import { productsRoutes } from "./products";

export const shopRoutes = [
  ...categoryRoutes,
  ...materialRoutes,
  ...concernRoutes,
  ...productsRoutes,
];
