import { TableCrudService } from "@/utils/service/TableCrudService";
import { supabase } from "@/setup";

export interface IConcern {
  id?: string;
  name: string;
  icon?: string;
}

export class ConcernService extends TableCrudService<IConcern> {
  constructor() {
    super("concerns", ["id", "name"]);
  }

  public buildSelect() {
    return this.builder
      .select(this.search_fields.join(" , "), {
        count: "exact",
      })
      .order("created_at", { ascending: true });
  }

  async remove(id: string | number) {
    console.log(this);
    const { error } = await supabase.from("concerns").delete().eq("id", id);
    return error;
  }
}
