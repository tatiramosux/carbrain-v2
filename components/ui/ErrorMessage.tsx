import React from "react";

interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable component for displaying error or hint messages below form fields.
 * It applies a consistent styling: small red text with a top margin.
 */
export function ErrorMessage({ children, className }: ErrorMessageProps) {
  return (
    <p className={`mt-1 text-sm text-red-500 ${className ?? ""}`.trim()}>{children}</p>
  );
}
