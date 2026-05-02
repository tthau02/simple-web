"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientRoutes } from "@/config/routes";
import { useRegisterMutation } from "@/hooks/api";
import { ApiError } from "@/lib/api-client";
import { showToast } from "@/lib/toast";

type FormState = {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
};

function empty(): FormState {
  return {
    userName: "",
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  };
}

export function RegisterView() {
  const [values, setValues] = useState<FormState>(() => empty());
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );

  const registerMutation = useRegisterMutation();

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!values.userName.trim()) next.userName = "Bắt buộc";
    if (!values.fullName.trim()) next.fullName = "Bắt buộc";
    if (!values.email.trim()) next.email = "Bắt buộc";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Email không hợp lệ";
    if (!values.password) next.password = "Bắt buộc";
    else if (values.password.length < 6) next.password = "Ít nhất 6 ký tự";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    registerMutation.mutate(
      {
        userName: values.userName.trim(),
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        phoneNumber: values.phoneNumber.trim() || undefined,
      },
      {
        onSuccess: () => {
          showToast({
            type: "success",
            title: "Đăng ký thành công",
            message: "Bạn có thể chuyển sang trang đăng nhập.",
            color: "success",
          });
          setValues(empty());
          setErrors({});
        },
        onError: (err) => {
          const message =
            err instanceof ApiError ? err.message : "Đăng ký thất bại.";
          showToast({
            type: "error",
            title: "Đăng ký thất bại",
            message,
            color: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="ds-auth-view ds-auth-view-clip">
      <p className="ds-auth-greeting">Hello,</p>
      <h1 className="ds-auth-title">Create your account</h1>

      <form className="ds-auth-form-register" onSubmit={handleSubmit}>
        <div className="grid min-h-0 grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <Field
            label="Username"
            id="reg-u"
            value={values.userName}
            onChange={(v) => setValues((s) => ({ ...s, userName: v }))}
            autoComplete="username"
            placeholder="Username"
            error={errors.userName}
          />
          <Field
            label="Full name"
            id="reg-name"
            value={values.fullName}
            onChange={(v) => setValues((s) => ({ ...s, fullName: v }))}
            autoComplete="name"
            placeholder="Full name"
            error={errors.fullName}
          />
          <Field
            label="Email"
            id="reg-email"
            type="email"
            value={values.email}
            onChange={(v) => setValues((s) => ({ ...s, email: v }))}
            autoComplete="email"
            placeholder="Email"
            error={errors.email}
          />
          <Field
            label="Password"
            id="reg-pw"
            type="password"
            value={values.password}
            onChange={(v) => setValues((s) => ({ ...s, password: v }))}
            autoComplete="new-password"
            placeholder="Password"
            error={errors.password}
          />
          <div className="sm:col-span-2">
            <Field
              label="Phone (tuỳ chọn)"
              id="reg-phone"
              type="tel"
              value={values.phoneNumber}
              onChange={(v) => setValues((s) => ({ ...s, phoneNumber: v }))}
              autoComplete="tel"
              placeholder="Số điện thoại"
              error={errors.phoneNumber}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="ds-btn-primary-pill"
        >
          {registerMutation.isPending ? "Đang xử lý…" : "Sign up"}
        </Button>
      </form>

      <p className="ds-auth-footer mt-4">
        Already have an account?{" "}
        <Link href={clientRoutes.login} className="ds-link-heading">
          Login here
        </Link>
      </p>

      <div className="ds-auth-store-row ds-auth-store-row-compact">
        <span className="ds-store-badge">App Store</span>
        <span className="ds-store-badge">Google Play</span>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  error,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (next: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <Label htmlFor={id} className="ds-text-overline">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="ds-auth-input"
        aria-invalid={Boolean(error)}
      />
      {error ? (
        <p className="ds-field-error-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
