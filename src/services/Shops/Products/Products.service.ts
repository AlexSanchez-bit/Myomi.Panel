import { supabase } from "@/setup";
import { TableCrudService } from "@/utils/service/TableCrudService";
import type {
  PostgrestError,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

export interface IProduct {
  name: string;
  short_description?: string;
  long_description?: string;
  price: number;
  stock: number;
  images: string[];
  categories?: number[];
  materials?: number[];
  brand?: number;
}

export class ProductsService extends TableCrudService<IProduct> {
  constructor() {
    super("product", [
      "id",
      "name",
      "price",
      "created_at",
      "stock",
      "sales",
      "brand(name,id,icon)",
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
      .select(
        "*, categories:product_category (category_id),materials:product_materials (material_id)",
      )
      .eq("id", id)
      .single();

    if (!error) {
      data.categories = data.categories.map((category) => category.category_id);
      data.materials = data.materials.map((material) => material.material_id);
    }

    return { data, error } as PostgrestSingleResponse<IProduct>;
  }

  async create(data: IProduct) {
    const { data: product_data, error: insert_error } = await supabase
      .from(this.tablename)
      .insert({
        name: data.name,
        short_description: data.short_description,
        long_description: data.long_description,
        price: data.price,
        images: data.images,
      })
      .select()
      .single();

    if (insert_error) {
      return insert_error;
    }

    await this.uploadProductRelations(
      "product_category",
      "category_id",
      data.categories,
      product_data.id,
    );

    if (data.materials) {
      await this.uploadProductRelations(
        "product_materials",
        "material_id",
        data.materials,
        product_data.id,
      );
    }
    return null;
  }

  async update(id: number, data: IProduct) {
    const { data: product_data, error: insert_error } = await supabase
      .from(this.tablename)
      .update({
        name: data.name,
        short_description: data.short_description,
        long_description: data.long_description,
        price: data.price,
        images: data.images,
      })
      .eq("id", id);

    if (insert_error) {
      return insert_error;
    }

    return null;
  }

  async update_categories(
    id: number,
    old_categories: number[],
    new_categories: number[],
  ) {
    const to_upload_categories = new_categories.filter(
      (nc: number) => !old_categories.includes(nc),
    );
    const to_remove_categories = old_categories.filter(
      (nc: number) => !new_categories.includes(nc),
    );

    await this.uploadProductRelations(
      "product_category",
      "category_id",
      to_upload_categories,
      id,
    );

    await this.removeProductRelations(
      "product_category",
      "category_id",
      to_remove_categories,
      id,
    );
  }

  async update_materials(
    id: number,
    old_materials: number[],
    new_materials: number[],
  ) {
    const to_upload_materials = new_materials.filter(
      (nc: number) => !old_materials.includes(nc),
    );
    const to_remove_materials = old_materials.filter(
      (nc: number) => !new_materials.includes(nc),
    );

    await this.uploadProductRelations(
      "product_materials",
      "material_id",
      to_upload_materials,
      id,
    );

    await this.removeProductRelations(
      "product_materials",
      "material_id",
      to_remove_materials,
      id,
    );
  }

  async uploadProductRelations(
    relation_name: string,
    element_key: string,
    elements_ids: number[],
    product_id: number,
  ) {
    const promises = elements_ids.map(async (element_id: number) => {
      const { error } = await supabase
        .from(relation_name)
        .insert({ [element_key]: element_id, product_id });
      return error;
    });

    return await Promise.all(promises);
  }

  async removeProductRelations(
    relation_name: string,
    element_key: string,
    elements_ids: number[],
    product_id: number,
  ) {
    const promises = elements_ids.map(async (element_id: number) => {
      const { error } = await supabase
        .from(relation_name)
        .delete()
        .eq(element_key, element_id)
        .eq("product_id", product_id);
      return error;
    });

    return await Promise.all(promises);
  }
}
