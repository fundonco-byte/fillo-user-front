"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "deactive" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",

          // Size variants
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-base": size === "md",
            "h-12 px-6 text-lg": size === "lg",
          },

          // Style variants - Figma 디자인 기반
          {
            // Primary - Main purple
            "bg-brand-primary text-white shadow-sm hover:bg-brand-primary-dark focus:ring-brand-primary":
              variant === "primary",

            // Secondary - Light purple
            "bg-purple-100 text-brand-primary hover:bg-purple-200 focus:ring-brand-primary":
              variant === "secondary",

            // Primary - Main purple
            "bg-gray-300 text-gray-500 shadow-sm focus:ring-brand-primary":
              variant === "deactive",

            // Outline - Purple border
            "border border-brand-primary text-brand-primary bg-white hover:bg-purple-50 focus:ring-brand-primary":
              variant === "outline",

            // Ghost - No background
            "text-brand-primary hover:bg-purple-50 focus:ring-brand-primary":
              variant === "ghost",

            // Link - Text only
            "text-brand-primary underline-offset-4 hover:underline focus:ring-brand-primary":
              variant === "link",
          },

          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && leftIcon}
        {children}
        {!isLoading && rightIcon && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
