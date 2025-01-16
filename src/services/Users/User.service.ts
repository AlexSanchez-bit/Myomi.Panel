import { TableService } from "@/utils/service/TableService";
import { supabase } from "@/setup";

export class UserService extends TableService<any> {
  constructor() {
    super("user", ["id,email", "name", "created_at"]);
  }

  async getUserData(id: string) {
    const { data, error } = await supabase
      .from(this.tablename)
      .select()
      .eq("id", id);
    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }
    return { data, error };
  }

  async createUser(name: string, email: string, password: string) {
    const { data, error } = await supabase.functions.invoke("create_user", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }
    return data;
  }

  async editUser(id: string, name: string, last_name: string, email: string) {
    const { error } = await supabase
      .from(this.tablename)
      .update({ name, last_name, email })
      .eq("id", id);
    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }

    return error;
  }

  async deleteUser(id: string) {
    const { error } = await supabase.from(this.tablename).delete().eq("id", id);
    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }

    return error;
  }
}
