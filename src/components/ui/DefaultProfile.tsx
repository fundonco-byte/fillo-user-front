"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface DefaultProfileProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const DefaultProfile = ({ size = "md", className }: DefaultProfileProps) => {
  return (
    <div
      className={cn(
        // Base styles - Figma 디자인 기반
        "flex items-center justify-center rounded-full bg-gray-100 text-gray-500",
        "border border-gray-200",

        // Size variants
        {
          "w-8 h-8": size === "sm",
          "w-10 h-10": size === "md",
          "w-12 h-12": size === "lg",
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
          "w-20 h-20": size === "xl",
        })}
        strokeWidth={1.5}
      />
    </div>
  );
};

export default DefaultProfile;
