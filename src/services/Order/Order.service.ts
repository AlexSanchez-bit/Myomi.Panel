import { Filter } from "@/utils/entities/Filter";
import { Pagination } from "@/utils/entities/Pagination";
import { Sorter } from "@/utils/entities/Sorters";
import { supabase } from "@/setup";
import { TableCrudService } from "@/utils/service/TableCrudService";
import type { ICurrency } from "../Currency/Currency.service";
import type { ILocation } from "../Locations/Locations.service";
import type { IProduct } from "../Shops/Products/Products.service";

export interface IContact {
  id?: number;
  name: string;
  phone_number: string;
  address: string;
  municipality: ILocation;
}

export interface IOrder {
  id?: number;
  contact: any;
  currency: ICurrency;
  user_id?: string;
  session_id?: string;
  payment_type_id: string;
  total: number;
  delivery_currency: ICurrency;
  delivery_payment: number;
  status: OrderStatus;
  products: {
    product: IProduct;
    price: number;
    quantity: number;
  }[];
  change: number;
}

export enum OrderStatus {
  CREATED = "CREATED",
  PAID = "PAID",
  CANCELED = "CANCELED",
  DELIVERED = "DELIVERED",
}

export class OrderService extends TableCrudService<IOrder> {
  constructor() {
    super("order", [
      "*",
      "user!left(*)",
      "products:order_product!inner(*,product(*))",
      "payment_type!inner(*)",
    ]);
  }

  public async getAll(
    filters: Filter<any>[],
    pagination: Pagination,
    orders: Sorter[] | null,
  ): Promise<any[]> {
    if (
      filters.find(
        (item) => item.field == "user_id" && item.matchMode == "IS",
      ) ||
      filters.length == 0
    ) {
      this.search_fields[1] = "user!left(*)";
    } else {
      this.search_fields[1] = "user!inner(*)";
    }
    return await super.getAll(filters, pagination, orders);
  }

  public async getAllTotalCount(
    filters: Filter<any>[],
    pagination: Pagination,
    orders: Sorter[] | null,
  ): Promise<any> {
    if (
      filters.find(
        (item) => item.field == "user_id" && item.matchMode == "IS",
      ) ||
      filters.length == 0
    ) {
      this.search_fields[1] = "user!left(*)";
    } else {
      this.search_fields[1] = "user!inner(*)";
    }
    return await super.getAllTotalCount(filters, pagination, orders);
  }

  async createOrder(newData: IOrder) {
    return await supabase.functions.invoke("create_order", {
      method: "POST",
      body: newData,
    });
  }
}
