import type { Metadata } from "next";

import { LoginView } from "./login-view";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản Café.",
};

export default function LoginPage() {
  return <LoginView />;
}
