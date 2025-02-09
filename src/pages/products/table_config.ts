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
    field: "brand",
    header: "brand",
    filter: {
      matchMode: FilterMatchMode.CONTAINS,
      value: null,
    },
    sorteable: false,
  },
  {
    field: "price",
    header: "price",
    filter: {
      matchMode: FilterMatchMode.GREATER_THAN,
      value: null,
    },
    sorteable: true,
    dataType: "numeric",
  },
  {
    field: "stock",
    header: "stock",
    filter: {
      matchMode: FilterMatchMode.GREATER_THAN,
      value: null,
    },
    sorteable: true,
    dataType: "numeric",
  },
  {
    field: "sales",
    header: "sales",
    sorteable: true,
    dataType: "numeric",
  },
  {
    field: "created_at",
    header: "created_at",
    filter: { value: null, matchMode: FilterMatchMode.EQUALS },
    sorteable: true,
    dataType: "date",
  },
];
