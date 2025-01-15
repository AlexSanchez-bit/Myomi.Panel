import { TableService } from "@/utils/service/TableService";

export class NewsLetter extends TableService<any> {
  constructor() {
    super("newsletter", ["email", "created_at"]);
  }
}
