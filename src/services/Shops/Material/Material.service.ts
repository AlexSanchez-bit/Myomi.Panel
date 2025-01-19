import { TableService } from "@/utils/service/TableService";
import { supabase } from "@/setup";

export class MaterialService extends TableService<any> {
  constructor() {
    super("material", ["id", "name"]);
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

  async createMaterial(name: string, description: string) {
    const { error } = await supabase.from(this.tablename).insert({
      name,
      description,
    });
    return error;
  }

  async updateMaterial(id: string, name: string, description: string) {
    const { error } = await supabase
      .from(this.tablename)
      .update({
        name,
        description,
      })
      .eq("id", id);

    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }

    return error;
  }

  async deleteMaterial(id: string) {
    return await supabase.from(this.tablename).delete().eq("id", id);
  }
}
