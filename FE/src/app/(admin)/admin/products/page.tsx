"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  ActionPanel,
  CommonForm,
  CommonFormItems,
  CommonHeader,
  CommonTable,
  CommonTableFilter,
  getCommonFormRuleErrors,
  type CommonFormItem,
  type CommonFormSelectOption,
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
  editingRow: ProductRow | null;
};

type ProductFormDraft = {
  sku: string;
  name: string;
  price: string;
  stock: string;
  status: string;
  contactEmail: string;
  /** ISO (từ date picker) hoặc rỗng */
  saleDate: string;
  /** ISO datetime (ô datetime-local) */
  publishedAt: string;
  /** URL hiện có hoặc file mới chọn */
  coverImage: string | File | null;
};

const EMPTY_PRODUCT_DRAFT: ProductFormDraft = {
  sku: "",
  name: "",
  price: "",
  stock: "",
  status: "Đang bán",
  contactEmail: "",
  saleDate: "",
  publishedAt: "",
  coverImage: null,
};

function productRowToDraft(row: ProductRow): ProductFormDraft {
  return {
    sku: row.sku,
    name: row.name,
    price: String(row.price),
    stock: String(row.stock),
    status: row.status,
    contactEmail: row.contactEmail,
    saleDate: "",
    publishedAt: row.updatedAt,
    coverImage: row.thumbnail,
  };
}

function thumbnailFromForm(
  cover: ProductFormDraft["coverImage"],
  seed: string,
): string {
  if (cover instanceof File) return URL.createObjectURL(cover);
  if (typeof cover === "string" && cover) return cover;
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/96/96`;
}

const PRODUCT_STATUS_OPTIONS: CommonFormSelectOption[] = [
  { value: "Đang bán", label: "Đang bán" },
  { value: "Hết hàng", label: "Hết hàng" },
  { value: "Nháp", label: "Nháp" },
];

/**
 * Có thể trộn `row` / `col` ở top-level (không cần `section`) và `section` khi cần tiêu đề.
 * `headerVariant: "plain"` gọn hơn `divided` khi block section nằm cạnh nhiều hàng thường.
 */
const PRODUCT_FORM_ITEMS: CommonFormItem<ProductFormDraft>[] = [
  {
    type: "row",
    columnsClassName: "md:grid-cols-2",
    children: [
      {
        type: "input",
        name: "sku",
        label: "SKU",
        autoComplete: "off",
        rules: { required: true, minLength: 1, maxLength: 100 },
      },
      {
        type: "input",
        name: "name",
        label: "Tên sản phẩm",
        rules: { required: true, maxLength: 200 },
      },
    ],
  },
  {
    type: "row",
    id: "price-stock",
    columnsClassName: "md:grid-cols-2",
    children: [
      {
        type: "number",
        name: "price",
        label: "Giá (VNĐ)",
        placeholder: "Nhập giá (VNĐ)",
        rules: { required: true, min: 0, max: 1_000_000_000_000 },
      },
      {
        type: "number",
        name: "stock",
        label: "Tồn kho",
        placeholder: "Nhập tồn kho",
        rules: { required: true, min: 0, max: 999_999_999 },
      },
    ],
  },
  {
    type: "row",
    columnsClassName: "md:grid-cols-12",
    className: "items-start",
    children: [
      {
        type: "col",
        span: 6,
        children: [
          {
            type: "select",
            name: "status",
            label: "Trạng thái",
            options: PRODUCT_STATUS_OPTIONS,
            searchable: true,
            searchPlaceholder: "Tìm trạng thái…",
            rules: { required: true },
          },
        ],
      },
      {
        type: "col",
        span: 6,
        children: [
          {
            type: "input",
            name: "contactEmail",
            label: "Email liên hệ",
            inputType: "email",
          },
        ],
      },
    ],
  },
  {
    type: "section",
    id: "section-dates-media",
    as: "div",
    title: "Lịch & ảnh",
    headerVariant: "divided",
    children: [
      {
        type: "row",
        id: "dates-media",
        columnsClassName: "md:grid-cols-12",
        className: "items-start",
        children: [
          {
            type: "col",
            span: 4,
            children: [
              {
                type: "date",
                name: "saleDate",
                label: "Ngày mở bán",
                placeholder: "Chọn ngày",
              },
            ],
          },
          {
            type: "col",
            span: 4,
            children: [
              {
                type: "datetime",
                name: "publishedAt",
                label: "Hiển thị từ",
                placeholder: "Chọn ngày & giờ",
              },
            ],
          },
          {
            type: "col",
            span: 4,
            children: [
              {
                type: "image",
                name: "coverImage",
                label: "Ảnh đại diện",
                maxPreviewClassName: "max-h-44",
              },
            ],
          },
        ],
      },
    ],
  },
];

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
    id: "6",
    sku: "FD-CRO-010B",
    name: "Croissant bơ (lô 2)",
    thumbnail: "https://picsum.photos/seed/cro2/96/96",
    detailPath: "/admin/products/6",
    price: 28000,
    stock: 30,
    status: "Nháp",
    contactEmail: "draft@example.com",
    updatedAt: "2026-04-17T16:45:00",
  },
  {
    id: "7",
    sku: "FD-CRO-010C",
    name: "Croissant bơ (lô 3)",
    thumbnail: "https://picsum.photos/seed/cro3/96/96",
    detailPath: "/admin/products/7",
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
  const [products, setProducts] = useState<ProductRow[]>(FAKE_PRODUCTS);
  const [panelState, setPanelState] = useState<ProductActionPanelState>({
    open: false,
    mode: "add",
    editingRow: null,
  });
  const [productForm, setProductForm] =
    useState<ProductFormDraft>(EMPTY_PRODUCT_DRAFT);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ProductFormDraft, string>>
  >({});

  const rows = useMemo(() => {
    let list = [...products];

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
  }, [sortKey, sortDirection, filterValues, products]);

  const handleSearch = () => {
    console.info("[demo] search with filters", filterValues);
  };

  const handleReset = () => {
    setFilterValues(defaultFilterValues);
    setSortKey("name");
    setSortDirection("asc");
  };

  const openActionPanel = (mode: "add" | "edit", row: ProductRow | null) => {
    setFormErrors({});
    setProductForm(
      mode === "edit" && row
        ? productRowToDraft(row)
        : { ...EMPTY_PRODUCT_DRAFT },
    );
    setPanelState({ open: true, mode, editingRow: row });
  };

  const handlePanelConfirm = (): boolean => {
    const nextErrors = getCommonFormRuleErrors(PRODUCT_FORM_ITEMS, productForm);
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return false;

    const price = Number(String(productForm.price).replace(/\D/g, "")) || 0;
    const stock = Math.max(0, parseInt(String(productForm.stock), 10) || 0);
    const sku = productForm.sku.trim();
    const name = productForm.name.trim();

    const now = new Date().toISOString();
    const email = productForm.contactEmail.trim() || "order@example.com";

    if (panelState.mode === "add") {
      const id = crypto.randomUUID();
      setProducts((prev) => [
        ...prev,
        {
          id,
          sku,
          name,
          thumbnail: `https://picsum.photos/seed/${encodeURIComponent(sku)}/96/96`,
          detailPath: `/admin/products/${id}`,
          price,
          stock,
          status: productForm.status,
          contactEmail: email,
          updatedAt: now,
        },
      ]);
      return true;
    }
    if (panelState.editingRow) {
      const id = panelState.editingRow.id;
      setProducts((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                sku,
                name,
                price,
                stock,
                status: productForm.status,
                contactEmail: email,
                updatedAt: now,
              }
            : r,
        ),
      );
      return true;
    }
    return false;
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
      options: PRODUCT_STATUS_OPTIONS,
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
        onOpenChange={(open) => {
          setPanelState((prev) => ({ ...prev, open }));
          if (!open) setFormErrors({});
        }}
        title={panelState.mode === "add" ? "Thêm sản phẩm" : "Sửa sản phẩm"}
        onConfirm={handlePanelConfirm}
      >
        <CommonForm
          id="admin-product-form"
          className="min-w-0"
          onSubmit={(e) => {
            e.preventDefault();
            if (handlePanelConfirm() === false) return;
            setPanelState((p) => ({ ...p, open: false }));
          }}
        >
          <CommonFormItems
            idPrefix="admin-product"
            items={PRODUCT_FORM_ITEMS}
            values={productForm}
            errors={formErrors}
            onValuesChange={(patch) => {
              setProductForm((f) => ({ ...f, ...patch }));
              setFormErrors((prev) => {
                const next = { ...prev };
                for (const k of Object.keys(
                  patch,
                ) as (keyof ProductFormDraft)[]) {
                  delete next[k];
                }
                return next;
              });
            }}
          />
        </CommonForm>
      </ActionPanel>
    </div>
  );
}
