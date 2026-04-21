"use client";

import * as React from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CommonHeaderAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  /** Mở tab mới khi có href http(s) */
  external?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  disabled?: boolean;
}

export interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  actions?: CommonHeaderAction[];
  className?: string;
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

const actionBtnClass =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-[50px] px-4 text-[0.85rem] font-semibold tracking-[-0.01em] transition-all duration-200 active:scale-95";

const actionVariantClass: Record<
  NonNullable<CommonHeaderAction["variant"]>,
  string
> = {
  default:
    "border border-[#00754A] bg-[#00754A] text-white hover:bg-[#006241] hover:border-[#006241]",
  outline: "border border-[#00754A] bg-white text-[#00754A] hover:bg-[#f2f0eb]",
  secondary:
    "border border-black/12 bg-[#f9f9f9] text-[rgba(0,0,0,0.87)] hover:bg-[#edebe9]",
  ghost:
    "border border-transparent bg-transparent text-[#00754A] hover:bg-[#f2f0eb]",
  destructive:
    "border border-[#c82014] bg-white text-[#c82014] hover:bg-red-50",
};

/**
 * Thanh tiêu đề full width: trái là title, phải là các action.
 * Truyền một object props (`CommonHeaderProps`).
 */
export function CommonHeader(props: CommonHeaderProps) {
  const { title, subtitle, actions, className } = props;

  return (
    <header
      className={cn(
        "flex w-full sm:flex-row sm:items-start sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div className="min-w-0 flex-1 flex items-baseline gap-2">
        <h2
          className={cn(
            "text-base font-semibold tracking-[-0.01em] text-[var(--text-primary)] md:text-lg",
          )}
        >
          {title}
        </h2>

        {subtitle ? (
          <p className="text-[13px] font-medium tracking-[0.05em] text-[var(--text-secondary)] opacity-80">
            {subtitle}
          </p>
        ) : null}
      </div>

      {actions?.length ? (
        <div className="flex w-full shrink-0 flex-wrap items-center justify-start gap-4 sm:w-auto sm:justify-end sm:gap-4">
          {actions.map((action) => {
            const v = action.variant ?? "outline";
            const content = (
              <>
                {action.icon ? (
                  <span className="shrink-0 [&_svg]:size-3.5">
                    {action.icon}
                  </span>
                ) : null}
                {action.label}
              </>
            );

            if (action.href && !action.disabled) {
              const ext = action.external ?? isExternalHref(action.href);
              const cls = cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                actionBtnClass,
                actionVariantClass[v],
              );
              if (ext) {
                return (
                  <a
                    key={action.id}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      cls,
                      "inline-flex items-center justify-center",
                    )}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className={cn(cls, "inline-flex items-center justify-center")}
                >
                  {content}
                </Link>
              );
            }

            return (
              <Button
                key={action.id}
                type="button"
                variant={v}
                size="sm"
                className={cn(actionBtnClass, actionVariantClass[v])}
                disabled={action.disabled}
                onClick={action.onClick}
              >
                {content}
              </Button>
            );
          })}
        </div>
      ) : null}
    </header>
  );
}
