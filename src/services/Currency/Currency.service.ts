import { TableCrudService } from "@/utils/service/TableCrudService";

export interface ICurrency {
  name: string;
  change_value: number;
}

export class CurrencyService extends TableCrudService<ICurrency> {
  constructor() {
    super("currency", ["id", "name", "change_value"]);
  }

  public buildSelect() {
    return this.builder.select(this.search_fields.join(" , "), {
      count: "exact",
    });
  }
}
