"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      size = "md",
      checked,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            className={cn(
              // Base styles - Figma 디자인 기반
              "peer sr-only",
              className
            )}
            ref={ref}
            checked={checked}
            disabled={disabled}
            {...props}
          />
          <div
            className={cn(
              // Base checkbox styles
              "relative flex items-center justify-center border-2 rounded-md transition-all duration-200",
              "peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-brand-primary",

              // Size variants
              {
                "w-4 h-4": size === "sm",
                "w-5 h-5": size === "md",
                "w-6 h-6": size === "lg",
              },

              // State variants
              {
                // Unchecked state
                "border-gray-300 bg-white hover:border-brand-primary":
                  !checked && !disabled,

                // Checked state
                "border-brand-primary bg-brand-primary": checked && !disabled,

                // Disabled state
                "border-gray-200 bg-gray-100 cursor-not-allowed": disabled,

                // Disabled checked state
                "border-gray-300 bg-gray-300": disabled && checked,
              },

              // Error state
              error &&
                !disabled &&
                "border-accent-error focus:ring-accent-error"
            )}
          >
            {checked && (
              <Check
                className={cn(
                  "text-white",
                  {
                    "w-3 h-3": size === "sm",
                    "w-3.5 h-3.5": size === "md",
                    "w-4 h-4": size === "lg",
                  },
                  disabled && "text-gray-500"
                )}
                strokeWidth={3}
              />
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                className={cn(
                  "block text-sm font-medium cursor-pointer",
                  disabled ? "text-gray-400" : "text-gray-900",
                  error && "text-accent-error"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                className={cn(
                  "text-sm mt-1",
                  disabled ? "text-gray-400" : "text-gray-500"
                )}
              >
                {description}
              </p>
            )}
            {error && <p className="text-sm text-accent-error mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
