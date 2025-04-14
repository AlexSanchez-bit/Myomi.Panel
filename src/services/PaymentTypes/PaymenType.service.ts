import { supabase } from "@/setup";
import { TableCrudService } from "@/utils/service/TableCrudService";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import type { ICurrency } from "@/services/Currency/Currency.service";

export interface IPaymentType {
  id: number;
  name: string;
  icon: string;
  external: boolean;
  delivery_included: boolean;
  delivery_currency: number;
  allowed_currencies: ICurrency[] | number[];
  may_have_change: boolean;
  fee: number;
}

export class PaymentTypeService extends TableCrudService<IPaymentType> {
  constructor() {
    super("payment_type", [
      "*,allowed_currencies:payment_type_currency!inner(*,currency(*))",
    ]);
  }

  public buildSelect() {
    return this.builder.select(this.search_fields.join(" , "), {
      count: "exact",
    });
  }

  async getDetails(id: string | number) {
    const { data, error } = await supabase
      .from(this.tablename)
      .select("*,allowed_currencies:payment_type_currency!inner(*)")
      .eq("id", id)
      .single();

    return { data, error } as PostgrestSingleResponse<IPaymentType>;
  }

  async create(data: IPaymentType) {
    const { data: payment_data, error: insert_error } = await supabase
      .from(this.tablename)
      .insert({
        name: data.name,
        icon: data.icon,
        external: data.external,
        delivery_included: data.delivery_included,
        delivery_currency: data.delivery_currency,
        may_have_change: data.may_have_change,
        fee: data.fee,
      })
      .select()
      .single();

    if (insert_error) {
      return insert_error;
    }
    await this.uploadProductRelations(
      "payment_type_currency",
      "currency_id",
      data.allowed_currencies as number[],
      payment_data.id,
    );

    return null;
  }

  async update(id: number, data: IPaymentType) {
    const { data: product_data, error: insert_error } = await supabase
      .from(this.tablename)
      .update({
        name: data.name,
        icon: data.icon,
        external: data.external,
        delivery_included: data.delivery_included,
        delivery_currency: data.delivery_currency,
        may_have_change: data.may_have_change,
        fee: data.fee,
      })
      .eq("id", id);

    if (insert_error) {
      return insert_error;
    }

    return null;
  }

  async update_currency(
    id: number,
    old_currencies: number[],
    new_currencies: number[],
  ) {
    const to_upload_currencies = new_currencies.filter(
      (nc: number) => !old_currencies.includes(nc),
    );
    const to_remove_currencies = old_currencies.filter(
      (nc: number) => !new_currencies.includes(nc),
    );

    await this.uploadProductRelations(
      "payment_type_currency",
      "currency_id",
      to_upload_currencies,
      id,
    );

    await this.removeProductRelations(
      "payment_type_currency",
      "currency_id",
      to_remove_currencies,
      id,
    );
  }

  async uploadProductRelations(
    relation_name: string,
    element_key: string,
    elements_ids: number[],
    payment_type_id: number,
  ) {
    const promises = elements_ids.map(async (element_id: number) => {
      const { error } = await supabase
        .from(relation_name)
        .insert({ [element_key]: element_id, payment_type_id });
      return error;
    });

    return await Promise.all(promises);
  }

  async removeProductRelations(
    relation_name: string,
    element_key: string,
    elements_ids: number[],
    payment_type_id: number,
  ) {
    const promises = elements_ids.map(async (element_id: number) => {
      const { error } = await supabase
        .from(relation_name)
        .delete()
        .eq(element_key, element_id)
        .eq("payment_type_id", payment_type_id);
      return error;
    });

    return await Promise.all(promises);
  }
}
