import { TableService } from "@/utils/service/TableService";
import { supabase } from "@/setup";
import { TableCrudService } from "@/utils/service/TableCrudService";

export class UserService extends TableCrudService<any> {
  constructor() {
    super("user", [
      "id,email,phone_number,profile_picture",
      "name",
      "created_at",
    ]);
  }

  async getUserData(id: string) {
    const { data, error } = await supabase
      .from(this.tablename)
      .select()
      .eq("id", id)
      .single();
    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }
    return { data, error };
  }

  async createUser(
    name: string,
    last_name: string,
    email: string,
    phone_number: string,
    password: string,
    profile_picture: string,
  ) {
    const { data, error } = await supabase.functions.invoke("create_user", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name,
        last_name,
        phone_number,
        profile_picture,
      }),
    });

    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }
    return data;
  }

  async updateUser(
    id: string,
    name: string,
    email: string,
    last_name?: string,
    phone?: string,
    profile_picture?: string,
  ) {
    const { error } = await supabase
      .from(this.tablename)
      .update({ name, email, phone_number: phone, profile_picture, last_name })
      .eq("id", id);

    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }

    return error;
  }
}
