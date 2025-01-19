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
];
