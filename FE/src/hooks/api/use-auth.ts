"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth-service";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
  });
}
