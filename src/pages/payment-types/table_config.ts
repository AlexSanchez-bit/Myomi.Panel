import { ColumnData } from "@/utils/entities/ColumnData";
import { FilterMatchMode } from "primevue/api";
export const table_configs: ColumnData[] = [
  {
    field: "actions",
    header: "actions",
  },
  {
    field: "name",
    header: "name",
    filter: {
      matchMode: FilterMatchMode.CONTAINS,
      value: null,
    },
    sorteable: false,
  },
  {
    field: "allowed_currencies",
    header: "allowed_currencies",
    filter: {
      matchMode: FilterMatchMode.IN,
      value: null,
    },
    filter_field: "allowed_currencies.currency_id",
    showFilterOptions: false,
    sorteable: false,
    dataType: "numeric",
  },
  {
    field: "icon",
    header: "icon",
    sorteable: false,
    showFilterOptions: false,
  },
  {
    field: "external",
    header: "external_payment",
    sorteable: false,
    filter: { value: null, matchMode: FilterMatchMode.EQUALS },
    dataType: "boolean",
  },
  {
    field: "delivery_included",
    header: "delivery_included",
    sorteable: false,
    filter: { value: null, matchMode: FilterMatchMode.EQUALS },
    dataType: "boolean",
  },
  {
    field: "may_have_change",
    header: "may_have_change",
    sorteable: false,
    filter: { value: null, matchMode: FilterMatchMode.EQUALS },
    dataType: "bool",
  },
];
