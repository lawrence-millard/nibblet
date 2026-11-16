"use client";

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./NibbleButton.module.css";

type Variant = "primary" | "secondary" | "icon";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
};

export function NibbleButton({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...rest
}: Props) {
  const classes = [
    styles.btn,
    styles[variant],
    variant !== "icon" ? styles[size] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className={styles.spin} aria-hidden />
      ) : (
        icon
      )}
      {variant !== "icon" && children}
      {variant === "icon" && !icon && !loading && children}
    </button>
  );
}
