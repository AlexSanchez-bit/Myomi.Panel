import { TableCrudService } from "@/utils/service/TableCrudService";

export interface ILocation {
  id?: number;
  name: string;
  delivery_price: number;
}

export class LocationService extends TableCrudService<ILocation> {
  constructor() {
    super("location", ["id", "name", "delivery_price"]);
  }

  public buildSelect() {
    return this.builder.select(this.search_fields.join(" , "), {
      count: "exact",
    });
  }
}
