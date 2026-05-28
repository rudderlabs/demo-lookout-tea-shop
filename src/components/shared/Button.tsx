'use client';

import type { ButtonHTMLAttributes } from 'react';

const variantStyles = {
  primary:
    'bg-matcha text-white hover:bg-matcha-dark active:bg-matcha-dark/90 shadow-sm',
  secondary:
    'bg-oolong text-white hover:bg-oolong-light active:bg-oolong-light/90 shadow-sm',
  outline:
    'border-2 border-matcha text-matcha hover:bg-matcha/10 active:bg-matcha/20',
} as const;

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3 text-lg',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
