import { formatPrice } from '@/lib/utils/format';

interface PriceDisplayProps {
  price: number;
  currency?: string;
  className?: string;
}

export function PriceDisplay({
  price,
  currency = 'USD',
  className = '',
}: PriceDisplayProps): React.JSX.Element {
  return (
    <span className={`font-semibold text-charcoal ${className}`}>
      {formatPrice(price, currency)}
    </span>
  );
}
