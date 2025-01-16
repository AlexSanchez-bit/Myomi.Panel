import { Validators } from "@/utils/Users/form_control/Validators";
import { reactive, watch } from "vue";
export function useUserForm(
  name?: string,
  last_name?: string,
  email?: string,
  password?: string,
  password_confirm?: string,
) {
  const { _name, _last_name, _email, _password, _password_confirm } = {
    _name: reactive({ value: name, validity: !!name, touched: !!name }),
    _last_name: reactive({
      value: last_name,
      validity: !!last_name,
      touched: !!last_name,
    }),
    _email: reactive({ value: email, validity: !!email, touched: !!email }),
    _password: reactive({
      value: password,
      validity: false,
      touched: !!password,
    }),
    _password_confirm: reactive({
      value: password_confirm,
      validity: false,
      touched: !!password_confirm,
    }),
  };

  watch(
    () => _name.value,
    (_new, _old) => {
      _name.validity = Validators.required(_new);
      console.log(_name.validity, _name.value, _name.touched);
    },
  );
  watch(
    () => _last_name.value,
    (_new, _old) => {
      _last_name.validity = Validators.required(_last_name.value);
    },
  );
  watch(
    () => _email.value,
    (_new, _old) => {
      _email.validity =
        Validators.required(_email.value) && Validators.email(_email.value);
    },
  );
  watch(
    () => _password.value,
    (_new, _old) => {
      _password.validity =
        Validators.required(_password.value) &&
        Validators.min(_password.value, 6);
      _password_confirm.validity = Validators.equals_to(
        _password_confirm.value,
        _password.value,
      );
    },
  );
  watch(
    () => _password_confirm.value,
    (_new, _old) => {
      _password_confirm.validity = Validators.equals_to(
        _password_confirm.value,
        _password.value,
      );
    },
  );

  return {
    name: _name,
    last_name: _last_name,
    email: _email,
    password: _password,
    password_confirm: _password_confirm,
  };
}
