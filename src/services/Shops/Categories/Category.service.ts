import { TableService } from "@/utils/service/TableService";
import { supabase } from "@/setup";

export class CategoryService extends TableService<any> {
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

  async getDetails(id: string) {
    const { data, error } = await supabase
      .from(this.tablename)
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }
    return { data, error };
  }

  async createCategory(
    name: string,
    parent: number,
    icon: string,
    description: string,
  ) {
    const { error } = await supabase.from(this.tablename).insert({
      name,
      parent,
      icon,
      description,
    });
    return error;
  }

  async updateCategory(
    id: string,
    name: string,
    parent: number,
    icon: string,
    description: string,
  ) {
    const { error } = await supabase
      .from(this.tablename)
      .update({
        name,
        parent,
        icon,
        description,
      })
      .eq("id", id);

    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }

    return error;
  }

  async deleteCategory(id: string) {
    return await supabase.from(this.tablename).delete().eq("id", id);
  }
}
