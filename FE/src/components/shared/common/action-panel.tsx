"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type ActionPanelTab = {
  value: string;
  label: string;
};

export type ActionPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  tabs?: ActionPanelTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  className?: string;
};

export function ActionPanel({
  open,
  onOpenChange,
  title,
  tabs,
  activeTab,
  onTabChange,
  confirmLabel = "Lưu",
  cancelLabel = "Hủy",
  onConfirm,
  className,
}: ActionPanelProps) {
  const hasTabs =
    Boolean(tabs?.length) &&
    typeof activeTab === "string" &&
    typeof onTabChange === "function";

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn("w-full max-w-[46rem]", className)}>
        <DrawerHeader className="gap-4 border-b border-black/8">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {hasTabs ? (
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="p-4 pt-3"
          >
            <TabsList>
              {tabs!.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}

        <div className="flex-1" />

        <DrawerFooter className="border-t border-black/8">
          <div className="flex items-center justify-center gap-3">
            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-[50px] border-[#00754A] px-3.5 text-xs font-semibold tracking-[-0.01em] text-[#00754A] transition-all duration-200 hover:bg-[#f2f0eb] active:scale-95"
              >
                {cancelLabel}
              </Button>
            </DrawerClose>
            <Button
              type="button"
              className="h-8 rounded-[50px] border border-[#00754A] bg-[#00754A] px-3.5 text-xs font-semibold tracking-[-0.01em] text-white transition-all duration-200 hover:border-[#006241] hover:bg-[#006241] active:scale-95"
              onClick={() => {
                onConfirm?.();
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
