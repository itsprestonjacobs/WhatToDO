"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, children, className = "", ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20",
      secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700",
      ghost: "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100",
      danger: "bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-800/50",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
