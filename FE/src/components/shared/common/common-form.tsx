"use client";

import * as React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Asterisk,
  CalendarIcon,
  Check,
  ChevronDown,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/** Viền + nền + focus — token theme (muted/input/primary/destructive). */
const commonFormSurfaceClassName =
  "rounded-[12px] border border-input bg-muted " +
  "text-sm text-foreground " +
  "placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground " +
  "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Ô một dòng: cùng chiều cao, chiều ngang, padding & placeholder (input / trigger select-date…).
 * Neutral Cool + Green Accent (DESIGN.md).
 */
export const commonFormControlClassName = cn(
  commonFormSurfaceClassName,
  "box-border h-9 min-h-9 w-full max-w-full px-2.5 py-0 text-sm font-normal leading-none",
);

/** Textarea: cùng padding ngang, min-height riêng. */
export const commonFormTextareaClassName = cn(
  commonFormSurfaceClassName,
  "min-h-20 w-full max-w-full resize-y px-2.5 py-2.5 text-sm font-normal leading-normal",
);

/** Icon cùng kích thước ở trigger (lịch, mũi tên, ảnh…). */
const formFieldInlineIconClass = "size-4 shrink-0 text-muted-foreground";

const labelTextClass =
  "w-full min-w-0 max-w-full cursor-text select-text text-sm font-medium leading-snug tracking-[-0.01em] text-foreground";
const descTextClass =
  "select-text text-sm leading-snug text-muted-foreground";
/** Lỗi validate: chữ nhỏ hơn mô tả thường */
const fieldErrorTextClass = "text-xs font-normal leading-snug text-destructive";

const formTriggerValueClass = cn(
  "min-w-0 flex-1 truncate text-left text-sm font-normal leading-none",
  "text-foreground",
);
const formTriggerPlaceholderClass = "text-muted-foreground";

export type CommonFormSelectOption = { value: string; label: string };

export type CommonFormColSpan =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

const colSpanToClass: Record<CommonFormColSpan, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  11: "md:col-span-11",
  12: "md:col-span-12",
};

function parseFormDateValue(v: unknown): Date | undefined {
  if (v == null || v === "") return undefined;
  if (v instanceof Date) {
    return Number.isNaN(v.getTime()) ? undefined : v;
  }
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function dateDisplayLabel(d: Date | undefined, placeholder: string): string {
  if (!d) return placeholder;
  return format(d, "PPP", { locale: vi });
}

function timeToInputValue(d: Date | undefined): string {
  if (!d || Number.isNaN(d.getTime())) return "00:00";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function datetimeButtonLabel(d: Date | undefined, placeholder: string): string {
  if (!d || Number.isNaN(d.getTime())) return placeholder;
  return format(d, "Pp", { locale: vi });
}

type StringKeyOf<T extends Record<string, unknown>> = Extract<keyof T, string>;

/**
 * Ràng buộc khai báo theo field (bản cơ bản: required, độ dài, khoảng số, pattern, tùy chỉnh).
 * Gọi `getCommonFormRuleErrors(items, values)` khi submit / blur rồi truyền kết quả vào `errors` của `CommonFormItems`.
 */
export type CommonFormFieldRules<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  required?: boolean;
  requiredMessage?: string;
  minLength?: number;
  minLengthMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
  /** Số: so sánh giá trị số; chuỗi/textarea: nếu không dùng minLength, có thể bỏ qua (ưu tiên dùng minLength cho độ dài chuỗi) */
  min?: number;
  minMessage?: string;
  max?: number;
  maxMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
  /**
   * Khi bật, chuỗi không rỗng phải giống email (bỏ qua nếu trống trừ khi `required`).
   * Field `type: "email"` cũng tự kiểm tra định dạng nếu có giá trị.
   */
  emailFormat?: boolean;
  emailFormatMessage?: string;
  /** Thêm bước kiểm tra tùy ý; trả về thông điệp lỗi hoặc `undefined` nếu hợp lệ (chạy sau các quy tắc trên) */
  validate?: (value: unknown, allValues: T) => string | undefined;
};

/** Map giá trị field → nhãn cạnh `switch` (`Object.is`). */
export type CommonFormSwitchMappingEntry = {
  key: unknown;
  text: string;
};

type CommonFormFieldBase<T extends Record<string, unknown>> = {
  /** Nếu không truyền, dùng `idPrefix` + `name` trong CommonFormItems */
  id?: string;
  name: StringKeyOf<T>;
  label: string;
  description?: string;
  /** Ghi đè lỗi từ `errors[name]` nếu có */
  error?: string;
  /** Quy tắc — dùng với `getCommonFormRuleErrors` */
  rules?: CommonFormFieldRules<T>;
  className?: string;
  fieldClassName?: string;
  disabled?: boolean;
};

const defaultMessages = {
  required: "Trường bắt buộc",
  minLength: (n: number) => `Tối thiểu ${n} ký tự`,
  maxLength: (n: number) => `Tối đa ${n} ký tự`,
  min: (n: number) => `Giá trị tối thiểu là ${n}`,
  max: (n: number) => `Giá trị tối đa là ${n}`,
  pattern: "Định dạng không hợp lệ",
  email: "Email không hợp lệ",
} as const;

const looseEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseNumericValue(v: unknown): number | null {
  if (v == null || v === "") return null;
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  const n = Number(String(v).replace(/\s/g, "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function isFieldValueEmpty(
  field: CommonFormFieldConfig<Record<string, unknown>>,
  value: unknown,
): boolean {
  const t = field.type;
  if (t === "switch") return value !== true;
  if (t === "image") {
    if (value == null || value === "") return true;
    if (typeof value === "string" && !value.trim()) return true;
    return false;
  }
  if (t === "number") {
    if (value === "" || value == null) return true;
    if (typeof value === "number" && !Number.isNaN(value)) return false;
    return parseNumericValue(value) == null;
  }
  if (t === "date" || t === "datetime") {
    if (value == null || value === "") return true;
    const d = new Date(String(value));
    return Number.isNaN(d.getTime());
  }
  if (t === "select") {
    if (value == null || value === "") return true;
    return String(value).trim() === "";
  }
  if (value == null) return true;
  return String(value).trim() === "";
}

function shouldCheckEmail(
  field: CommonFormFieldConfig<Record<string, unknown>>,
  rules: CommonFormFieldRules,
  value: unknown,
  empty: boolean,
): boolean {
  if (empty) return false;
  if (rules.emailFormat) return true;
  if (field.type === "email") return true;
  if (field.type === "input" && field.inputType === "email") return true;
  return false;
}

function getRuleErrorForField<T extends Record<string, unknown>>(
  field: CommonFormFieldConfig<T>,
  values: T,
): string | undefined {
  const value = values[field.name as StringKeyOf<T>];
  const empty = isFieldValueEmpty(
    field as unknown as CommonFormFieldConfig<Record<string, unknown>>,
    value,
  );
  const rules = field.rules;

  if (!rules) {
    if (empty) return undefined;
    const trimmed = String(value).trim();
    if (
      shouldCheckEmail(
        field as unknown as CommonFormFieldConfig<Record<string, unknown>>,
        {},
        value,
        empty,
      ) &&
      !looseEmail.test(trimmed)
    ) {
      return defaultMessages.email;
    }
    return undefined;
  }

  if (empty) {
    if (rules.required) {
      return rules.requiredMessage ?? defaultMessages.required;
    }
    return undefined;
  }

  const s = String(value);
  const trimmed = s.trim();

  if (rules.minLength != null && trimmed.length < rules.minLength) {
    return rules.minLengthMessage ?? defaultMessages.minLength(rules.minLength);
  }
  if (rules.maxLength != null && trimmed.length > rules.maxLength) {
    return rules.maxLengthMessage ?? defaultMessages.maxLength(rules.maxLength);
  }

  if (field.type === "number" && (rules.min != null || rules.max != null)) {
    const n = parseNumericValue(value);
    if (n == null) {
      return "Giá trị không hợp lệ";
    }
    if (rules.min != null && n < rules.min) {
      return rules.minMessage ?? defaultMessages.min(rules.min);
    }
    if (rules.max != null && n > rules.max) {
      return rules.maxMessage ?? defaultMessages.max(rules.max);
    }
  }

  if (
    shouldCheckEmail(
      field as unknown as CommonFormFieldConfig<Record<string, unknown>>,
      rules as CommonFormFieldRules,
      value,
      empty,
    ) &&
    !looseEmail.test(trimmed)
  ) {
    return rules.emailFormatMessage ?? defaultMessages.email;
  }

  if (rules.pattern && !rules.pattern.test(s)) {
    return rules.patternMessage ?? defaultMessages.pattern;
  }

  if (rules.validate) {
    return rules.validate(value, values);
  }

  return undefined;
}

/**
 * Duyệt tất cả field (kể cả trong `row` / `col` / `section`) và trả lỗi theo `name` (dòng đầu thắng nếu trùng tên).
 */
function forEachFormField<T extends Record<string, unknown>>(
  items: CommonFormItem<T>[],
  visit: (field: CommonFormFieldConfig<T>) => void,
): void {
  for (const item of items) {
    if (item.type === "row" || item.type === "col" || item.type === "section") {
      forEachFormField(item.children, visit);
    } else {
      visit(item);
    }
  }
}

/**
 * Tính toán lỗi từ `rules` trên cấu hình form. Hợp với `errors` từ API: gộp `getCommonFormRuleErrors(...)`, sau đó spread lỗi server.
 */
export function getCommonFormRuleErrors<T extends Record<string, unknown>>(
  items: CommonFormItem<T>[],
  values: T,
): Partial<Record<StringKeyOf<T>, string>> {
  const out: Partial<Record<StringKeyOf<T>, string>> = {};
  forEachFormField(items, (field) => {
    const e = getRuleErrorForField(field, values);
    if (e == null) return;
    if (out[field.name] != null) return;
    out[field.name] = e;
  });
  return out;
}

/** Các trường gắn dữ liệu `values[name]` */
export type CommonFormFieldConfig<T extends Record<string, unknown>> =
  | (CommonFormFieldBase<T> & {
      type: "input";
      inputType?: React.HTMLInputTypeAttribute;
      placeholder?: string;
      inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
      autoComplete?: string;
    })
  | (CommonFormFieldBase<T> & {
      type: "email";
      placeholder?: string;
      autoComplete?: string;
    })
  | (CommonFormFieldBase<T> & {
      type: "password";
      placeholder?: string;
      autoComplete?: string;
    })
  | (CommonFormFieldBase<T> & {
      type: "number";
      min?: number;
      max?: number;
      step?: number | "any";
      placeholder?: string;
    })
  | (CommonFormFieldBase<T> & {
      type: "textarea";
      placeholder?: string;
      rows?: number;
    })
  | (CommonFormFieldBase<T> & {
      type: "select";
      options: CommonFormSelectOption[];
      placeholder?: string;
      selectSize?: "sm" | "default";
      /** `true`: hiện ô tìm; `false`/undefined: ẩn (class `hidden` trên vùng tìm) */
      searchable?: boolean;
      searchPlaceholder?: string;
      /** Gộp thêm class lên vùng ô tìm (ví dụ tự ẩn/hiện) */
      searchClassName?: string;
    })
  | (CommonFormFieldBase<T> & {
      type: "switch";
      /** Map `values[name]` → nhãn hiển thị cạnh switch (`Object.is`). */
      switchMapping?: ReadonlyArray<CommonFormSwitchMappingEntry>;
      /** Class cho hàng gồm switch + nhãn */
      switchRowClassName?: string;
    })
  | (CommonFormFieldBase<T> & {
      type: "date";
      /** Hiển thị khi chưa chọn; mặc định "Chọn ngày" */
      placeholder?: string;
    })
  | (CommonFormFieldBase<T> & {
      type: "datetime";
      /** Hiển thị gợi ý; giá trị lưu ISO string (UTC) */
      placeholder?: string;
    })
  | (CommonFormFieldBase<T> & {
      type: "image";
      /** Mặc định hình ảnh; giá trị: URL chuỗi, `File` mới chọn, hoặc rỗng */
      accept?: string;
      selectLabel?: string;
      clearLabel?: string;
      /** Class chiều cao tối đa vùng xem trước, vd `max-h-40` */
      maxPreviewClassName?: string;
    })
  | (CommonFormFieldBase<T> & {
      type: "custom";
      render: (ctx: {
        id: string;
        name: StringKeyOf<T>;
        value: T[StringKeyOf<T>];
        values: T;
        error?: string;
        disabled?: boolean;
        onChange: (next: T[StringKeyOf<T>]) => void;
        onValuesChange: (patch: Partial<T>) => void;
      }) => React.ReactNode;
    });

/** Hàng: lưới tuỳ chỉnh, thường dùng `columnsClassName` (vd: `md:grid-cols-2` hoặc `md:grid-cols-12`) */
export type CommonFormRowConfig<T extends Record<string, unknown>> = {
  type: "row";
  id?: string;
  className?: string;
  /** Class cho grid con (mặc định: `grid w-full grid-cols-1 gap-5`) */
  columnsClassName?: string;
  children: CommonFormItem<T>[];
};

/** Cột: dùng với hàng 12 cột; `span` = md:col-span-… */
export type CommonFormColConfig<T extends Record<string, unknown>> = {
  type: "col";
  id?: string;
  className?: string;
  span?: CommonFormColSpan;
  children: CommonFormItem<T>[];
};

/** Cách hiển thị header phần (có thể dùng `plain` khi trộn nhiều hàng thường) */
export type CommonFormSectionHeaderVariant = "divided" | "plain";

/** Nhóm / phần: bọc nhiều `row` / `col` / `section` lồng, có tiêu đề tùy chọn */
export type CommonFormSectionConfig<T extends Record<string, unknown>> = {
  type: "section";
  id?: string;
  /** `divided`: gạch dưới (mặc định). `plain`: gọn, không gạch — dễ trộn với block không section */
  headerVariant?: CommonFormSectionHeaderVariant;
  /** Mặc định `section`. Dùng `div` nếu tránh lồng nhiều `<section>`. */
  as?: "section" | "div";
  /** Tiêu đề phần (vd: "Thông tin cơ bản") */
  title?: string;
  /** Mô tả dưới tiêu đề */
  description?: string;
  className?: string;
  /** Class cho vùng chứa các dòng/ô con */
  contentClassName?: string;
  children: CommonFormItem<T>[];
};

export type CommonFormItem<T extends Record<string, unknown>> =
  | CommonFormFieldConfig<T>
  | CommonFormRowConfig<T>
  | CommonFormColConfig<T>
  | CommonFormSectionConfig<T>;

/** Tên kiểu field (dùng `type: …` trong cấu hình) */
export type CommonFormFieldKind = CommonFormFieldConfig<
  Record<string, unknown>
>["type"];

export type CommonFormProps = React.ComponentPropsWithoutRef<"form">;

export function CommonForm({ className, ...props }: CommonFormProps) {
  return (
    <form
      className={cn("flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  );
}

export type CommonFormFieldGroupProps = React.ComponentProps<typeof FieldGroup>;

/** Nhóm field thuần (không cấu hình) — tương đương `FieldGroup` + gap */
export function CommonFormFieldGroup({
  className,
  ...props
}: CommonFormFieldGroupProps) {
  return <FieldGroup className={cn("gap-5 md:gap-6", className)} {...props} />;
}

/** @deprecated dùng `CommonFormFieldGroup` — giữ tương thích */
export const CommonFormFields = CommonFormFieldGroup;
export type CommonFormFieldsProps = CommonFormFieldGroupProps;

type CommonFormItemsProps<T extends Record<string, unknown>> = {
  items: CommonFormItem<T>[];
  values: T;
  onValuesChange: (patch: Partial<T>) => void;
  /** Lỗi theo tên trường (merge với `error` từng field nếu có) */
  errors?: Partial<Record<StringKeyOf<T>, string>>;
  idPrefix?: string;
  className?: string;
};

function resolveId<T extends Record<string, unknown>>(
  idPrefix: string,
  def: { id?: string; name?: StringKeyOf<T> },
): string {
  if (def.id) return def.id;
  if (def.name) return `${idPrefix}-${String(def.name)}`;
  return idPrefix;
}

function resolveError<T extends Record<string, unknown>>(
  field: CommonFormFieldConfig<T>,
  errors?: Partial<Record<StringKeyOf<T>, string>>,
): string | undefined {
  return field.error ?? errors?.[field.name];
}

export function CommonFormItems<T extends Record<string, unknown>>({
  items,
  values,
  onValuesChange,
  errors,
  idPrefix = "form",
  className,
}: CommonFormItemsProps<T>) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col mt-3 gap-5 md:gap-6",
        className,
      )}
    >
      {items.map((item, index) => (
        <FormNodeRenderer
          key={
            "id" in item && item.id
              ? String(item.id)
              : "name" in item
                ? String(item.name)
                : `item-${index}`
          }
          idPrefix={idPrefix}
          path={`${index}`}
          node={item}
          values={values}
          onValuesChange={onValuesChange}
          errors={errors}
        />
      ))}
    </div>
  );
}

type FormNodeRendererProps<T extends Record<string, unknown>> = {
  idPrefix: string;
  path: string;
  node: CommonFormItem<T>;
  values: T;
  onValuesChange: (patch: Partial<T>) => void;
  errors?: Partial<Record<StringKeyOf<T>, string>>;
};

function FormNodeRenderer<T extends Record<string, unknown>>({
  idPrefix,
  path,
  node,
  values,
  onValuesChange,
  errors,
}: FormNodeRendererProps<T>) {
  if (node.type === "row") {
    return (
      <div
        className={cn(
          "grid w-full grid-cols-1 gap-5 md:gap-6",
          node.columnsClassName,
          node.className,
        )}
      >
        {node.children.map((child, i) => (
          <FormNodeRenderer
            key={node.id ? `${node.id}-${i}` : `${path}-r${i}`}
            idPrefix={idPrefix}
            path={`${path}.row.${i}`}
            node={child}
            values={values}
            onValuesChange={onValuesChange}
            errors={errors}
          />
        ))}
      </div>
    );
  }

  if (node.type === "col") {
    return (
      <div
        className={cn(
          node.span != null && colSpanToClass[node.span],
          "flex min-w-0 flex-col gap-5 md:gap-6",
          node.className,
        )}
      >
        {node.children.map((child, i) => (
          <FormNodeRenderer
            key={node.id ? `${node.id}-${i}` : `${path}-c${i}`}
            idPrefix={idPrefix}
            path={`${path}.col.${i}`}
            node={child}
            values={values}
            onValuesChange={onValuesChange}
            errors={errors}
          />
        ))}
      </div>
    );
  }

  if (node.type === "section") {
    const hasHeader = Boolean(
      (node.title != null && node.title !== "") || node.description,
    );
    const headerKind = node.headerVariant ?? "divided";
    const SectionRoot = node.as === "div" ? "div" : "section";
    return (
      <SectionRoot
        className={cn(
          "flex w-full min-w-0 flex-col gap-4 md:gap-5",
          node.className,
        )}
        id={node.id}
        data-slot="form-section"
      >
        {hasHeader ? (
          <header
            className={cn(
              "space-y-1",
              headerKind === "divided" && "border-b border-border pb-2.5",
              headerKind === "plain" && "pt-0.5",
            )}
          >
            {node.title != null && node.title !== "" ? (
              <h3
                className={cn(
                  "tracking-[-0.01em] text-foreground",
                  headerKind === "divided" && "text-sm font-semibold",
                  headerKind === "plain" &&
                    "text-xs font-semibold text-muted-foreground uppercase",
                )}
              >
                {node.title}
              </h3>
            ) : null}
            {node.description ? (
              <p
                className={cn(
                  "text-muted-foreground",
                  headerKind === "divided" &&
                    "text-sm font-normal leading-snug",
                  headerKind === "plain" && "text-xs font-normal leading-snug",
                )}
              >
                {node.description}
              </p>
            ) : null}
          </header>
        ) : null}
        <div
          className={cn(
            "flex w-full min-w-0 flex-col gap-5 md:gap-6",
            node.contentClassName,
          )}
        >
          {node.children.map((child, i) => (
            <FormNodeRenderer
              key={node.id ? `${node.id}-${i}` : `${path}-s${i}`}
              idPrefix={idPrefix}
              path={`${path}.s.${i}`}
              node={child}
              values={values}
              onValuesChange={onValuesChange}
              errors={errors}
            />
          ))}
        </div>
      </SectionRoot>
    );
  }

  return (
    <FormFieldBlock
      idPrefix={idPrefix}
      field={node}
      values={values}
      onValuesChange={onValuesChange}
      error={resolveError(node, errors)}
    />
  );
}

function formAriaDescribedBy(
  id: string,
  description: boolean,
  hasError: boolean,
): string | undefined {
  return (
    [description && `${id}-description`, hasError && `${id}-error`]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

type FormSelectFieldProps<T extends Record<string, unknown>> = {
  id: string;
  field: Extract<CommonFormFieldConfig<T>, { type: "select" }>;
  str: string;
  set: (next: T[Extract<keyof T, string>]) => void;
  error?: string;
  fieldShell: (control: React.ReactNode) => React.ReactNode;
};

/**
 * Select trong form: Popover + danh sách option (nút) — cùng pattern với select có ô tìm,
 * hoạt động ổn trong Drawer; hover/focus giống filter bảng.
 */
function FormSelectField<T extends Record<string, unknown>>({
  id,
  field,
  str,
  set,
  error,
  fieldShell,
}: FormSelectFieldProps<T>) {
  const searchable = field.searchable === true;
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const filtered = React.useMemo(() => {
    if (!searchable) return field.options;
    const qq = q.trim().toLowerCase();
    if (!qq) return field.options;
    return field.options.filter(
      (o) =>
        o.label.toLowerCase().includes(qq) ||
        o.value.toLowerCase().includes(qq),
    );
  }, [field.options, q, searchable]);

  const currentLabel = field.options.find((o) => o.value === str)?.label;
  const showPlaceholder = str === "" || currentLabel == null;
  const display = showPlaceholder
    ? (field.placeholder ?? "Chọn…")
    : (currentLabel ?? str);

  return fieldShell(
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger
        type="button"
        id={id}
        disabled={field.disabled}
        className={cn(
          "flex w-full min-w-0 max-w-full items-center justify-between gap-2 text-sm",
          "outline-none transition-colors duration-200 select-none",
          "enabled:hover:border-primary/40 enabled:hover:bg-accent",
          "enabled:focus-visible:border-primary enabled:focus-visible:ring-3 enabled:focus-visible:ring-ring/50",
          commonFormControlClassName,
          field.className,
        )}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={formAriaDescribedBy(
          id,
          Boolean(field.description),
          Boolean(error),
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={cn(
            formTriggerValueClass,
            showPlaceholder && formTriggerPlaceholderClass,
          )}
        >
          {display}
        </span>
        <ChevronDown
          className={cn(formFieldInlineIconClass, "shrink-0")}
          aria-hidden
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        className={cn(
          "w-(--anchor-width)! max-w-[min(100vw-1.5rem,24rem)]! gap-0! p-0!",
          "min-w-36 overflow-hidden border-0 bg-popover text-popover-foreground",
          "shadow-md ring-1 ring-border",
        )}
      >
        {searchable ? (
          <div
            className={cn(
              "border-b border-border bg-muted px-2 py-1.5",
              field.searchClassName,
            )}
            data-form-select-search="on"
          >
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={field.searchPlaceholder ?? "Tìm kiếm…"}
              className={cn(commonFormControlClassName)}
              autoComplete="off"
              disabled={field.disabled}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        ) : null}
        <ScrollArea
          className={cn("max-h-[min(50vh,16rem)]", searchable && "h-48")}
        >
          <ul className="p-1.5" role="listbox" aria-label={field.label}>
            {filtered.length === 0 ? (
              <li
                className={cn(
                  "px-2.5 py-2 text-sm font-normal text-muted-foreground",
                )}
              >
                Không có mục phù hợp
              </li>
            ) : (
              filtered.map((opt) => {
                const selected = str === opt.value;
                return (
                  <li key={opt.value || "__empty"} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={cn(
                        "relative flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-[10px] py-2 pr-8 pl-2.5",
                        "text-left text-sm font-normal text-foreground",
                        "outline-none transition-colors duration-150 select-none",
                        "hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:outline-none",
                        selected &&
                          "bg-primary/10 font-medium text-foreground ring-1 ring-primary/20",
                      )}
                      onClick={() => {
                        set(opt.value as T[Extract<keyof T, string>]);
                        setOpen(false);
                      }}
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {opt.label}
                      </span>
                      {selected ? (
                        <Check
                          className={cn(
                            formFieldInlineIconClass,
                            "pointer-events-none absolute right-2.5",
                          )}
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>,
  );
}

type FormImageFieldProps<T extends Record<string, unknown>> = {
  id: string;
  name: StringKeyOf<T>;
  field: Extract<CommonFormFieldConfig<T>, { type: "image" }>;
  value: unknown;
  set: (next: T[Extract<keyof T, string>]) => void;
  error?: string;
  fieldShell: (control: React.ReactNode) => React.ReactNode;
};

function FormImageField<T extends Record<string, unknown>>({
  id,
  name,
  field,
  value: v,
  set,
  error,
  fieldShell,
}: FormImageFieldProps<T>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (v instanceof File) {
      const u = URL.createObjectURL(v);
      setObjectUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setObjectUrl(null);
  }, [v]);

  const preview: string | null =
    v instanceof File && objectUrl
      ? objectUrl
      : typeof v === "string" && v
        ? v
        : null;

  const canClear = Boolean(
    v instanceof File || (typeof v === "string" && v.length > 0),
  );

  return fieldShell(
    <div className="flex w-full min-w-0 flex-col gap-2" role="group">
      <div className="flex w-full min-w-0 flex-wrap items-stretch gap-2">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={field.accept ?? "image/*"}
          className="sr-only"
          tabIndex={-1}
          disabled={field.disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={formAriaDescribedBy(
            id,
            Boolean(field.description),
            Boolean(error),
          )}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) set(f as T[Extract<keyof T, string>]);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={field.disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            commonFormControlClassName,
            "inline-flex h-9 min-w-0 w-auto! max-w-none flex-1 items-center justify-center gap-2",
            "text-sm font-medium text-foreground hover:bg-secondary active:scale-95",
          )}
        >
          <ImageIcon className={formFieldInlineIconClass} aria-hidden />
          <span className="truncate">{field.selectLabel ?? "Chọn ảnh"}</span>
        </Button>
        {canClear ? (
          <Button
            type="button"
            variant="ghost"
            className="h-9 min-w-0 shrink-0 px-2.5 text-sm font-medium text-destructive hover:text-destructive/90"
            disabled={field.disabled}
            onClick={() => set(null as T[Extract<keyof T, string>])}
          >
            {field.clearLabel ?? "Gỡ ảnh"}
          </Button>
        ) : null}
      </div>
      {preview ? (
        <div
          className={cn(
            "min-h-0 w-full overflow-hidden rounded-[12px] border border-border bg-card",
            field.maxPreviewClassName,
          )}
        >
          <img
            src={preview}
            alt="Xem trước"
            className="mx-auto max-h-48 w-full object-contain p-1"
          />
        </div>
      ) : null}
    </div>,
  );
}

type FormFieldBlockProps<T extends Record<string, unknown>> = {
  idPrefix: string;
  field: CommonFormFieldConfig<T>;
  values: T;
  onValuesChange: (patch: Partial<T>) => void;
  error?: string;
};

function FormFieldLabelRow({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <FieldLabel
      htmlFor={htmlFor}
      className={cn(
        labelTextClass,
        "inline-flex w-full min-w-0 max-w-full flex-wrap items-baseline gap-x-1 gap-y-0.5",
      )}
    >
      <span className="min-w-0">{children}</span>
      {required ? (
        <span
          className="inline-flex translate-y-px"
          title="Bắt buộc"
          aria-label="Bắt buộc"
        >
          <Asterisk
            className="size-3 shrink-0 self-center text-destructive"
            aria-hidden
            strokeWidth={2.5}
          />
        </span>
      ) : null}
    </FieldLabel>
  );
}

function FormFieldBlock<T extends Record<string, unknown>>({
  idPrefix,
  field,
  values,
  onValuesChange,
  error,
}: FormFieldBlockProps<T>) {
  const name = field.name;
  const id = resolveId<T>(idPrefix, field);
  const v = values[name] as T[typeof name];
  const set = (next: T[typeof name]) =>
    onValuesChange({ [name]: next } as unknown as Partial<T>);
  const showRequired = field.rules?.required === true;

  const fieldShell = (control: React.ReactNode) => (
    <Field
      data-invalid={error ? "true" : undefined}
      className={cn("w-full gap-2", field.fieldClassName)}
    >
      <FormFieldLabelRow htmlFor={id} required={showRequired}>
        {field.label}
      </FormFieldLabelRow>
      <FieldContent className="w-full min-w-0">
        {control}
        {field.description ? (
          <FieldDescription id={`${id}-description`} className={descTextClass}>
            {field.description}
          </FieldDescription>
        ) : null}
        {error ? (
          <FieldError id={`${id}-error`} className={fieldErrorTextClass}>
            {error}
          </FieldError>
        ) : null}
      </FieldContent>
    </Field>
  );

  if (field.type === "custom") {
    return (
      <div className={field.className}>
        {field.render({
          id,
          name,
          value: v,
          values,
          error,
          disabled: field.disabled,
          onChange: set,
          onValuesChange,
        })}
      </div>
    );
  }

  if (field.type === "switch") {
    const checked = Boolean(v);
    const mapping = field.switchMapping;
    const mappedLabel = mapping?.find((e) => Object.is(e.key, checked))?.text;
    const statusId = mappedLabel ? `${id}-switch-status` : undefined;
    const switchEl = (
      <Switch
        id={id}
        size="default"
        disabled={field.disabled}
        checked={checked}
        onCheckedChange={(next) => set(next as T[typeof name])}
        className={field.className}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          [
            statusId,
            field.description && `${id}-description`,
            error && `${id}-error`,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
    );
    return fieldShell(
      mapping?.length ? (
        <div
          className={cn(
            "flex flex-row flex-wrap items-center gap-3",
            field.switchRowClassName,
          )}
        >
          {switchEl}
          {mappedLabel ? (
            <span
              id={statusId}
              className="min-w-0 text-sm font-normal tracking-[-0.01em] text-muted-foreground"
              aria-live="polite"
            >
              {mappedLabel}
            </span>
          ) : null}
        </div>
      ) : (
        switchEl
      ),
    );
  }

  if (field.type === "select") {
    const str = v == null ? "" : String(v);
    return (
      <FormSelectField
        id={id}
        field={field}
        str={str}
        set={set}
        error={error}
        fieldShell={fieldShell}
      />
    );
  }

  if (field.type === "textarea") {
    const str = v == null ? "" : String(v);
    return fieldShell(
      <textarea
        id={id}
        name={name}
        rows={field.rows ?? 3}
        disabled={field.disabled}
        placeholder={field.placeholder}
        value={str}
        onChange={(e) => set(e.target.value as T[typeof name])}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          [field.description && `${id}-description`, error && `${id}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(commonFormTextareaClassName, field.className)}
      />,
    );
  }

  if (field.type === "number") {
    const n =
      typeof v === "number" ? v : v === "" || v == null ? "" : Number(v);
    return fieldShell(
      <Input
        id={id}
        type="number"
        name={name}
        min={field.min}
        max={field.max}
        step={field.step}
        disabled={field.disabled}
        placeholder={field.placeholder}
        value={n === "" || Number.isNaN(n) ? "" : n}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            set("" as T[typeof name]);
            return;
          }
          const num = e.target.valueAsNumber;
          set((Number.isNaN(num) ? "" : num) as T[typeof name]);
        }}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          [field.description && `${id}-description`, error && `${id}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(commonFormControlClassName, field.className)}
      />,
    );
  }

  if (field.type === "date") {
    const d = parseFormDateValue(v);
    const ph = field.placeholder ?? "Chọn ngày";
    return fieldShell(
      <Popover modal={false}>
        <PopoverTrigger
          type="button"
          id={id}
          disabled={field.disabled}
          className={cn(
            "flex w-full min-w-0 max-w-full items-center gap-2 text-left",
            commonFormControlClassName,
            field.className,
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={formAriaDescribedBy(
            id,
            Boolean(field.description),
            Boolean(error),
          )}
        >
          <CalendarIcon className={formFieldInlineIconClass} />
          <span
            className={cn(
              formTriggerValueClass,
              !d && formTriggerPlaceholderClass,
            )}
          >
            {dateDisplayLabel(d, ph)}
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto gap-0 p-0"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            locale={vi}
            selected={d}
            onSelect={(day) => {
              set((day != null ? day.toISOString() : "") as T[typeof name]);
            }}
            disabled={field.disabled}
          />
        </PopoverContent>
      </Popover>,
    );
  }

  if (field.type === "datetime") {
    const d = parseFormDateValue(v);
    const ph = field.placeholder ?? "Chọn ngày giờ";
    return fieldShell(
      <Popover modal={false}>
        <PopoverTrigger
          type="button"
          id={id}
          disabled={field.disabled}
          className={cn(
            "flex w-full min-w-0 max-w-full items-center gap-2 text-left",
            commonFormControlClassName,
            field.className,
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={formAriaDescribedBy(
            id,
            Boolean(field.description),
            Boolean(error),
          )}
        >
          <CalendarIcon className={formFieldInlineIconClass} />
          <span
            className={cn(
              formTriggerValueClass,
              (!d || Number.isNaN(d.getTime())) && formTriggerPlaceholderClass,
            )}
          >
            {datetimeButtonLabel(d, ph)}
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto gap-0 p-0"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            locale={vi}
            selected={d}
            onSelect={(day) => {
              if (day == null) {
                set("" as T[typeof name]);
                return;
              }
              const x = new Date(day);
              const prev = parseFormDateValue(v);
              if (prev && !Number.isNaN(prev.getTime())) {
                x.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
              } else {
                x.setHours(0, 0, 0, 0);
              }
              set(x.toISOString() as T[typeof name]);
            }}
            disabled={field.disabled}
          />
          <div className="flex min-h-9 w-full min-w-0 items-center gap-2 border-t border-border p-2.5">
            <span className="w-8 shrink-0 text-sm font-medium leading-none text-muted-foreground">
              Giờ
            </span>
            <Input
              type="time"
              step={60}
              value={timeToInputValue(d)}
              disabled={field.disabled}
              onChange={(e) => {
                const time = e.target.value;
                if (!time) return;
                const [hh, mm] = time.split(":").map((t) => parseInt(t, 10));
                const x = d ? new Date(d) : new Date();
                x.setHours(hh || 0, mm || 0, 0, 0);
                set(x.toISOString() as T[typeof name]);
              }}
              className={cn(
                commonFormControlClassName,
                "min-w-0! w-auto! max-w-none flex-1 scheme-light",
              )}
            />
          </div>
        </PopoverContent>
      </Popover>,
    );
  }

  if (field.type === "image") {
    return (
      <FormImageField
        id={id}
        name={name}
        field={field}
        value={v}
        set={set}
        error={error}
        fieldShell={fieldShell}
      />
    );
  }

  if (
    field.type === "email" ||
    field.type === "password" ||
    field.type === "input"
  ) {
    const str = v == null ? "" : String(v);
    if (field.type === "email") {
      return fieldShell(
        <Input
          id={id}
          type="email"
          name={name}
          disabled={field.disabled}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          value={str}
          onChange={(e) => set(e.target.value as T[typeof name])}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            [field.description && `${id}-description`, error && `${id}-error`]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(commonFormControlClassName, field.className)}
        />,
      );
    }
    if (field.type === "password") {
      return fieldShell(
        <Input
          id={id}
          type="password"
          name={name}
          disabled={field.disabled}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          value={str}
          onChange={(e) => set(e.target.value as T[typeof name])}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            [field.description && `${id}-description`, error && `${id}-error`]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(commonFormControlClassName, field.className)}
        />,
      );
    }
    return fieldShell(
      <Input
        id={id}
        type={field.inputType ?? "text"}
        name={name}
        disabled={field.disabled}
        placeholder={field.placeholder}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
        value={str}
        onChange={(e) => set(e.target.value as T[typeof name])}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          [field.description && `${id}-description`, error && `${id}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(commonFormControlClassName, field.className)}
      />,
    );
  }

  return null;
}

// ---- Legacy: component-level API (dùng trực tiếp) ----

export type CommonFormTextFieldProps = Omit<
  React.ComponentProps<"input">,
  "id"
> & {
  id: string;
  label: string;
  description?: string;
  error?: string;
  /** Giống `rules: { required: true }` trên cấu hình — hiện dấu * cạnh label */
  required?: boolean;
};

export function CommonFormTextField({
  id,
  label,
  description,
  error,
  required = false,
  className,
  disabled,
  ...inputProps
}: CommonFormTextFieldProps) {
  return (
    <Field data-invalid={error ? "true" : undefined} className="w-full gap-2">
      <FormFieldLabelRow htmlFor={id} required={required}>
        {label}
      </FormFieldLabelRow>
      <FieldContent className="w-full min-w-0">
        <Input
          id={id}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            [description && `${id}-description`, error && `${id}-error`]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(commonFormControlClassName, className)}
          {...inputProps}
        />
        {description ? (
          <FieldDescription id={`${id}-description`} className={descTextClass}>
            {description}
          </FieldDescription>
        ) : null}
        {error ? (
          <FieldError id={`${id}-error`} className={fieldErrorTextClass}>
            {error}
          </FieldError>
        ) : null}
      </FieldContent>
    </Field>
  );
}

export type CommonFormSelectFieldProps = {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options: CommonFormSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  disabled?: boolean;
  className?: string;
  size?: React.ComponentProps<typeof SelectTrigger>["size"];
};

export function CommonFormSelectField({
  id,
  label,
  description,
  error,
  required = false,
  placeholder = "Chọn…",
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  size = "default",
}: CommonFormSelectFieldProps) {
  const isControlled = value !== undefined;

  const items = options.map((o) => ({ value: o.value, label: o.label }));

  const select = (
    <Select
      modal={false}
      items={items}
      value={
        isControlled
          ? value != null && value !== ""
            ? value
            : null
          : undefined
      }
      defaultValue={!isControlled ? defaultValue : undefined}
      onValueChange={(v) => onValueChange?.(v)}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        size={size}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          [description && `${id}-description`, error && `${id}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn("w-full min-w-0", commonFormControlClassName, className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-popover text-popover-foreground">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <Field data-invalid={error ? "true" : undefined} className="w-full gap-2">
      <FormFieldLabelRow htmlFor={id} required={required}>
        {label}
      </FormFieldLabelRow>
      <FieldContent className="w-full min-w-0">
        {select}
        {description ? (
          <FieldDescription id={`${id}-description`} className={descTextClass}>
            {description}
          </FieldDescription>
        ) : null}
        {error ? (
          <FieldError id={`${id}-error`} className={fieldErrorTextClass}>
            {error}
          </FieldError>
        ) : null}
      </FieldContent>
    </Field>
  );
}
