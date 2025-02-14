import { TableCrudService } from "@/utils/service/TableCrudService";

export interface IGeneralConfig {
  carousell_images: string[];
  promotional_image: string;
}

export class GeneralConfigsService extends TableCrudService<IGeneralConfig> {
  constructor() {
    super("general_configs", ["id", "carousell_images", "promotional_image"]);
  }

  public buildSelect() {
    return this.builder.select(this.search_fields.join(" , "), {
      count: "exact",
    });
  }
}
