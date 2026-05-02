"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientRoutes } from "@/config/routes";
import { useLoginMutation } from "@/hooks/api";
import { ApiError } from "@/lib/api-client";
import { showToast } from "@/lib/toast";

const ACCESS_TOKEN_KEY = "accessToken";
const TOKEN_EXPIRY_KEY = "tokenExpiresAtUtc";

export function LoginView() {
  const router = useRouter();
  const [loginVal, setLoginVal] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    login?: string;
    password?: string;
  }>({});

  const loginMutation = useLoginMutation();

  const validate = () => {
    const next: typeof fieldErrors = {};
    if (!loginVal.trim()) next.login = "Nhập email hoặc tên đăng nhập.";
    if (!password) next.password = "Nhập mật khẩu.";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    loginMutation.mutate(
      { login: loginVal.trim(), password },
      {
        onSuccess: (data) => {
          showToast({
            type: "success",
            title: "Đăng nhập thành công",
            color: "success",
          });
          if (typeof window !== "undefined") {
            localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
            localStorage.setItem(TOKEN_EXPIRY_KEY, data.expiresAtUtc);
          }
          setLoginVal("");
          setPassword("");
          setFieldErrors({});
          router.replace(clientRoutes.home);
        },
        onError: (err) => {
          const message =
            err instanceof ApiError
              ? err.message
              : "Đăng nhập không thành công.";
          showToast({
            type: "error",
            title: "Đăng nhập thất bại",
            message,
            color: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="ds-auth-view">
      <p className="ds-auth-greeting">Hello,</p>
      <h1 className="ds-auth-title">Welcome back</h1>

      <form className="ds-auth-form-login" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="auth-login-id" className="sr-only">
              Email hoặc tên đăng nhập
            </Label>
            <Input
              id="auth-login-id"
              autoComplete="username"
              value={loginVal}
              onChange={(e) => setLoginVal(e.target.value)}
              placeholder="Username or email"
              className="ds-auth-input"
              aria-invalid={Boolean(fieldErrors.login)}
            />
            {fieldErrors.login ? (
              <p className="ds-field-error" role="alert">
                {fieldErrors.login}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="auth-login-password" className="sr-only">
              Mật khẩu
            </Label>
            <Input
              id="auth-login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="ds-auth-input"
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password ? (
              <p className="ds-field-error" role="alert">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>
        </div>

        <div className="ds-auth-tools-row">
          <div className="flex items-center gap-2">
            <Checkbox
              id="auth-remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
              className="ds-checkbox-brand"
            />
            <Label
              htmlFor="auth-remember"
              className="ds-auth-checkbox-label"
            >
              Remember me
            </Label>
          </div>
          <Link href="#" className="ds-link-brand shrink-0">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="ds-btn-primary-pill"
        >
          {loginMutation.isPending ? "Signing in…" : "Login"}
        </Button>
      </form>

      <p className="ds-auth-footer mt-5">
        Don&apos;t have an account?{" "}
        <Link href={clientRoutes.register} className="ds-link-heading">
          Sign up here
        </Link>
      </p>

      <div className="ds-auth-store-row">
        <span className="ds-store-badge">App Store</span>
        <span className="ds-store-badge">Google Play</span>
      </div>
    </div>
  );
}
