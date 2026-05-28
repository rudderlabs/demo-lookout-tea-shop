const variantStyles = {
  default: 'bg-matcha text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-oolong text-white',
} as const;

interface BadgeProps {
  variant?: keyof typeof variantStyles;
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  children,
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
