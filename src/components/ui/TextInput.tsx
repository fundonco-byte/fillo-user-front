"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "filled";
  isRequired?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      variant = "default",
      isRequired = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {label}
            {isRequired && <span className="text-accent-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              // Base styles - Figma 디자인 기반
              "w-full px-4 py-3 text-base text-purple-900 placeholder-purple-500",
              "border border-purple-300 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent",
              "transition-all duration-200",
              // Disabled state
              "disabled:bg-border-300 disabled:text-border-300 disabled:cursor-not-allowed",
              // Error state
              error && "border-accent-error focus:ring-accent-error",
              // Variant styles
              variant === "filled" && "bg-purple-50",
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <div className="mt-2">
            {error && <p className="text-sm text-accent-error">{error}</p>}
            {!error && helperText && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
