import { TableCrudService } from "@/utils/service/TableCrudService";
import { supabase } from "@/setup";

export interface ICategory {
  name: string;
  parent: number;
  icon: string;
  description: string;
}

export class CategoryService extends TableCrudService<ICategory> {
  constructor() {
    super("category", [
      "id",
      "name",
      "icon",
      "category:parent(id, name),created_at ",
    ]);
  }

  public buildSelect() {
    return this.builder.select(this.search_fields.join(" , "), {
      count: "exact",
    });
  }

  async remove(id: string | number) {
    console.log(this);
    const { error } = await supabase.from("category").delete().eq("id", id);
    return error;
  }
}
