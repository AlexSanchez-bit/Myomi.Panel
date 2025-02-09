import { TableCrudService } from "@/utils/service/TableCrudService";

export interface IBrand {
  id?: number;
  name: string;
  layer_image?: string;
  icon?: string;
  brand_link?: string;
}

export class BrandService extends TableCrudService<IBrand> {
  constructor() {
    super("brand", ["id", "name", "icon", "layer_image,brand_link"]);
  }

  public buildSelect() {
    return this.builder.select(this.search_fields.join(" , "), {
      count: "exact",
    });
  }
}
