import type { Metadata } from "next";

import { RegisterView } from "./register-view";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản thành viên Café.",
};

export default function RegisterPage() {
  return <RegisterView />;
}
