'use client';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps): React.JSX.Element {
  const isAtMin = quantity <= min;
  const isAtMax = quantity >= max;

  function handleDecrement(): void {
    if (!isAtMin) {
      onChange(quantity - 1);
    }
  }

  function handleIncrement(): void {
    if (!isAtMax) {
      onChange(quantity + 1);
    }
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-sage">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isAtMin}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center rounded-l-lg text-charcoal transition-colors hover:bg-steam disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <span className="flex h-9 w-10 items-center justify-center border-x border-sage text-sm font-medium text-charcoal">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={isAtMax}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center rounded-r-lg text-charcoal transition-colors hover:bg-steam disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
      </button>
    </div>
  );
}
