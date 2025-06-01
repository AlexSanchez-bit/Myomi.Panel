import { TableCrudService } from "@/utils/service/TableCrudService";

export interface IGeneralConfig {
  carousell_images?: string[];
  promotional_image?: string;
  month_promotion?: string;
  transfermovil_card_number: string,
  transfermovil_check_number: string
}

export class GeneralConfigsService extends TableCrudService<IGeneralConfig> {
  constructor() {
    super("general_configs", [
      "id",
      "carousell_images",
      "promotional_image",
      "month_promotion",
      "transfermovil_card_number",
      "transfermovil_check_number"
    ]);
  }

  public buildSelect() {
    return this.builder.select(this.search_fields.join(" , "), {
      count: "exact",
    });
  }
}
