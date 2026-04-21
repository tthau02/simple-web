"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  ActionPanel,
  CommonHeader,
  CommonTable,
  CommonTableFilter,
  type CommonHeaderProps,
  type CommonTableAction,
  type CommonTableColumn,
  type SortDirection,
  type TableFilterField,
  type TableFilterValues,
} from "@/components/shared/common";

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  thumbnail: string;
  detailPath: string;
  price: number;
  stock: number;
  status: string;
  contactEmail: string;
  updatedAt: string;
};

type ProductActionPanelState = {
  open: boolean;
  mode: "add" | "edit";
  tab: string;
  editingRow: ProductRow | null;
};

const FAKE_PRODUCTS: ProductRow[] = [
  {
    id: "1",
    sku: "CF-AMR-001",
    name: "Americano (nóng)",
    thumbnail: "https://picsum.photos/seed/amr/96/96",
    detailPath: "/admin/products/1",
    price: 45000,
    stock: 120,
    status: "Đang bán",
    contactEmail: "order@example.com",
    updatedAt: "2026-04-18T10:30:00",
  },
  {
    id: "2",
    sku: "CF-LAT-002",
    name: "Latte caramel",
    thumbnail: "https://picsum.photos/seed/lat/96/96",
    detailPath: "/admin/products/2",
    price: 59000,
    stock: 45,
    status: "Đang bán",
    contactEmail: "order@example.com",
    updatedAt: "2026-04-19T14:00:00",
  },
  {
    id: "3",
    sku: "CF-ESP-003",
    name: "Espresso đôi",
    thumbnail: "https://picsum.photos/seed/esp/96/96",
    detailPath: "/admin/products/3",
    price: 35000,
    stock: 0,
    status: "Hết hàng",
    contactEmail: "support@example.com",
    updatedAt: "2026-04-15T09:15:00",
  },
  {
    id: "4",
    sku: "FD-CRO-010",
    name: "Croissant bơ",
    thumbnail: "https://picsum.photos/seed/cro/96/96",
    detailPath: "/admin/products/4",
    price: 28000,
    stock: 30,
    status: "Nháp",
    contactEmail: "draft@example.com",
    updatedAt: "2026-04-17T16:45:00",
  },
  {
    id: "4",
    sku: "FD-CRO-010",
    name: "Croissant bơ",
    thumbnail: "https://picsum.photos/seed/cro/96/96",
    detailPath: "/admin/products/4",
    price: 28000,
    stock: 30,
    status: "Nháp",
    contactEmail: "draft@example.com",
    updatedAt: "2026-04-17T16:45:00",
  },
  {
    id: "4",
    sku: "FD-CRO-010",
    name: "Croissant bơ",
    thumbnail: "https://picsum.photos/seed/cro/96/96",
    detailPath: "/admin/products/4",
    price: 28000,
    stock: 30,
    status: "Nháp",
    contactEmail: "draft@example.com",
    updatedAt: "2026-04-17T16:45:00",
  },
];

function compareRows(
  a: ProductRow,
  b: ProductRow,
  key: keyof ProductRow,
  direction: SortDirection,
): number {
  const va = a[key];
  const vb = b[key];
  const sign = direction === "asc" ? 1 : -1;

  if (typeof va === "number" && typeof vb === "number") {
    return (va - vb) * sign;
  }

  const sa = va != null ? String(va) : "";
  const sb = vb != null ? String(vb) : "";
  return sa.localeCompare(sb, "vi", { numeric: true }) * sign;
}

export default function AdminProductsPage() {
  const defaultFilterValues: TableFilterValues = {
    q: "",
    status: "",
    inStockOnly: false,
    sortPreset: "default",
    updatedFrom: undefined as string | undefined,
    createdRange: { from: undefined, to: undefined },
  };
  const [sortKey, setSortKey] = useState<string | null>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    "asc",
  );
  const [filterValues, setFilterValues] = useState<TableFilterValues>(
    () => defaultFilterValues,
  );
  const [panelState, setPanelState] = useState<ProductActionPanelState>({
    open: false,
    mode: "add",
    tab: "general",
    editingRow: null,
  });

  const rows = useMemo(() => {
    let list = [...FAKE_PRODUCTS];

    const q = String(filterValues.q ?? "")
      .trim()
      .toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.sku.toLowerCase().includes(q) || r.name.toLowerCase().includes(q),
      );
    }

    const st = filterValues.status;
    if (typeof st === "string" && st) {
      list = list.filter((r) => r.status === st);
    }

    if (filterValues.inStockOnly === true) {
      list = list.filter((r) => r.stock > 0);
    }

    const fromIso = filterValues.updatedFrom;
    if (typeof fromIso === "string" && fromIso) {
      const from = new Date(fromIso).getTime();
      list = list.filter((r) => new Date(r.updatedAt).getTime() >= from);
    }

    if (!sortKey || !sortDirection) return list;
    const k = sortKey as keyof ProductRow;
    const preset = filterValues.sortPreset;
    if (preset === "price-asc") {
      return list.sort((a, b) => compareRows(a, b, "price", "asc"));
    }
    if (preset === "price-desc") {
      return list.sort((a, b) => compareRows(a, b, "price", "desc"));
    }
    return list.sort((a, b) => compareRows(a, b, k, sortDirection));
  }, [sortKey, sortDirection, filterValues]);

  const handleSearch = () => {
    console.info("[demo] search with filters", filterValues);
  };

  const handleReset = () => {
    setFilterValues(defaultFilterValues);
    setSortKey("name");
    setSortDirection("asc");
  };

  const openActionPanel = (mode: "add" | "edit", row: ProductRow | null) => {
    setPanelState({ open: true, mode, tab: "general", editingRow: row });
  };

  const columns: CommonTableColumn<ProductRow>[] = [
    {
      id: "thumbnail",
      label: "Ảnh",
      type: "img",
      imageSize: "sm",
      imageAltKey: "name",
    },
    { id: "sku", label: "SKU", type: "text", sortable: true },
    {
      id: "name",
      label: "Tên sản phẩm",
      type: "link",
      linkHrefKey: "detailPath",
      sortable: true,
    },
    { id: "price", label: "Giá", type: "currency", sortable: true },
    { id: "stock", label: "Tồn kho", type: "number", sortable: true },
    { id: "status", label: "Trạng thái", type: "badge" },
    { id: "contactEmail", label: "Liên hệ", type: "email" },
    { id: "updatedAt", label: "Cập nhật", type: "datetime", sortable: true },
  ];

  const filterFields: TableFilterField[] = [
    {
      type: "input",
      id: "q",
      label: "Tìm kiếm",
      placeholder: "Tìm kiếm sản phẩm",
    },
    {
      type: "select",
      id: "status",
      label: "Trạng thái",
      placeholder: "Tất cả",
      clearable: true,
      options: [
        { value: "Đang bán", label: "Đang bán" },
        { value: "Hết hàng", label: "Hết hàng" },
        { value: "Nháp", label: "Nháp" },
      ],
    },
    {
      type: "date",
      id: "updatedFrom",
      label: "Cập nhật từ",
      placeholder: "Chọn ngày",
    },
    {
      type: "daterange",
      id: "createdRange",
      label: "Khoảng thời gian (demo)",
      numberOfMonths: 2,
    },
  ];

  const pageHeader: CommonHeaderProps = {
    title: "Sản phẩm",
    subtitle: "danh sách",
    actions: [
      {
        id: "add",
        label: "Thêm mới",
        icon: <Plus className="size-3.5" aria-hidden />,
        variant: "default",
        onClick: () => openActionPanel("add", null),
      },
    ],
  };

  const actions: CommonTableAction<ProductRow>[] = [
    {
      id: "edit",
      label: "Sửa",
      icon: <Pencil className="size-3.5" aria-hidden />,
      variant: "outline",
      onClick: (row) => openActionPanel("edit", row),
    },
    {
      id: "delete",
      label: "Xóa",
      icon: <Trash2 className="size-3.5" aria-hidden />,
      variant: "destructive",
      onClick: (row) => {
        console.info("[demo] xóa sản phẩm", row.id, row.name);
      },
    },
  ];

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <CommonHeader {...pageHeader} />

      <div className="flex min-h-0 flex-col gap-4 lg:flex-row">
        <aside className="shrink-0 lg:w-72 lg:max-h-[min(100dvh,920px)] lg:overflow-y-auto xl:w-80">
          <CommonTableFilter
            fields={filterFields}
            values={filterValues}
            onChange={setFilterValues}
            onReset={handleReset}
            onSubmit={handleSearch}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <CommonTable<ProductRow>
            embed
            title=""
            columns={columns}
            data={rows}
            getRowKey={(row) => row.id}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={(key, direction) => {
              setSortKey(key);
              setSortDirection(direction);
            }}
            actions={actions}
          />
        </div>
      </div>

      <ActionPanel
        open={panelState.open}
        onOpenChange={(open) => setPanelState((prev) => ({ ...prev, open }))}
        title={panelState.mode === "add" ? "Thêm sản phẩm" : "Sửa sản phẩm"}
        tabs={[
          { value: "general", label: "Thông tin" },
          { value: "settings", label: "Thiết lập" },
        ]}
        activeTab={panelState.tab}
        onTabChange={(tab) => setPanelState((prev) => ({ ...prev, tab }))}
      />
    </div>
  );
}
