import { defineStore } from "pinia";
import { supabase } from "@/setup";
import { useToastStorage } from "@/stores/ToasterStorage";
import router from "@/router";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    // variables que definen el estado
    _authenticated: false as boolean,
    _userData: null as any,
  }),
  getters: {
    authenticated(state): any {
      if (!state._authenticated) {
        const user_saved_data = localStorage.getItem("userData");
        this._authenticated = user_saved_data != null;
      }
      return state._authenticated;
    },
    userData(state): any {
      if (state._authenticated) {
        if (!state._userData || state._userData == null) {
          this._userData = JSON.parse(localStorage.getItem("userData")!);
        }
        return this._userData;
      }
    },
  },
  actions: {
    autenticate(data: any) {
      console.log(data);
      localStorage.setItem("userData", JSON.stringify(data));
      this._authenticated = true;
      this._userData = data;
    },
    async logout() {
      const { notify } = useToastStorage();
      const data = await supabase.auth.signOut();
      if (data.error) {
        notify("error", "error", data.error.message, 4000);
      } else {
        localStorage.clear();
        this._authenticated = false;
        this._userData = null;
        router.push("/login");
      }
    },
    async login(email: string, password: string) {
      const resp = await supabase.auth.signInWithPassword({ email, password });
      if (resp.error) {
        const { notify } = useToastStorage();
        notify("error", "error", resp.error.message, 4000);
        return resp;
      }
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", resp.data.user.id)
        .single();
      if (!error) {
        this.autenticate(data);
      }

      return resp;
    },
  },
});
