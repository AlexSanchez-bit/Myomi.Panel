import { TableCrudService } from "@/utils/service/TableCrudService";

export interface ICurrency {
  name: string;
  change_value: number;
  icon?: string;
}

export class CurrencyService extends TableCrudService<ICurrency> {
  constructor() {
    super("currency", ["id", "name", "change_value", "icon"]);
  }

  public buildSelect() {
    return this.builder.select(this.search_fields.join(" , "), {
      count: "exact",
    });
  }
}
