import { TableCrudService } from "@/utils/service/TableCrudService";

export interface IGeneralConfig {
  carousell_images?: string[];
  promotional_image?: string;
  month_promotion?: string;
}

export class GeneralConfigsService extends TableCrudService<IGeneralConfig> {
  constructor() {
    super("general_configs", [
      "id",
      "carousell_images",
      "promotional_image",
      "month_promotion",
    ]);
  }

  public buildSelect() {
    return this.builder.select(this.search_fields.join(" , "), {
      count: "exact",
    });
  }
}
