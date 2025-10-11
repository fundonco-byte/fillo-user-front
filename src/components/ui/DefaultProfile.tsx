"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface DefaultProfileProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const DefaultProfile = ({ size = "md", className }: DefaultProfileProps) => {
  return (
    <div
      className={cn(
        // Base styles - 프로젝트 메인 색상 적용
        "flex items-center justify-center rounded-full bg-purple-50 text-brand-primary",
        "border border-purple-100",

        // Size variants - className prop으로 override 가능
        !className && {
          "w-8 h-8": size === "sm",
          "w-10 h-10": size === "md",
          "w-12 h-12": size === "lg",
          "w-32 h-32": size === "2xl",
          "w-40 h-40": size === "xl",
        },

        className
      )}
    >
      <User
        className={cn({
          "w-4 h-4": size === "sm",
          "w-5 h-5": size === "md",
          "w-6 h-6": size === "lg",
          "w-16 h-16": size === "2xl",
          "w-24 h-24 sm:w-32 sm:h-32": size === "xl",
        })}
        strokeWidth={1.5}
      />
    </div>
  );
};

export default DefaultProfile;
