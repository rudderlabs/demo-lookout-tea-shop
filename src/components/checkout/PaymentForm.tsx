'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/shared/Button';
import { getCurrentDemoPersona, selectRandomDemoPersona } from '@/data/demo-personas';
import {
  trackCheckoutStepCompleted,
  trackCheckoutStepViewed,
  trackPaymentInfoEntered,
  useRudderAnalytics,
} from '@/lib/analytics';

export interface PaymentData {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardHolder: string;
}

interface PaymentFormProps {
  onComplete: (data: PaymentData) => void;
  checkoutId: string;
  orderId: string;
}

const EMPTY_PAYMENT: PaymentData = {
  cardNumber: '',
  expiry: '',
  cvc: '',
  cardHolder: '',
};

function CreditCardIcon(): React.JSX.Element {
  return (
    <svg
      className="h-5 w-5 text-charcoal/40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function LockIcon(): React.JSX.Element {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

export function PaymentForm({
  onComplete,
  checkoutId,
  orderId,
}: PaymentFormProps): React.JSX.Element {
  const [form, setForm] = useState<PaymentData>(EMPTY_PAYMENT);
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentData, string>>>({});
  const analytics = useRudderAnalytics();

  useEffect(() => {
    if (analytics) {
      trackCheckoutStepViewed(analytics, {
        checkout_id: checkoutId,
        step: 2,
        step_name: 'Payment',
      });
    }
  }, [analytics, checkoutId]);

  function updateField(field: keyof PaymentData, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function formatExpiry(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof PaymentData, string>> = {};

    if (form.cardNumber.replace(/\s/g, '').length < 16)
      newErrors.cardNumber = 'Card number must be 16 digits';
    if (!form.expiry.trim() || form.expiry.length < 5)
      newErrors.expiry = 'Valid expiry required (MM/YY)';
    if (!form.cvc.trim() || form.cvc.length < 3)
      newErrors.cvc = 'CVC must be 3 digits';
    if (!form.cardHolder.trim())
      newErrors.cardHolder = 'Card holder name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (!validate()) return;

    if (analytics) {
      trackPaymentInfoEntered(analytics, {
        checkout_id: checkoutId,
        order_id: orderId,
        step: 2,
        payment_method: 'credit_card',
      });

      trackCheckoutStepCompleted(analytics, {
        checkout_id: checkoutId,
        step: 2,
        step_name: 'Payment',
      });
    }

    onComplete(form);
  }

  function handleFillDemo(): void {
    const demoPersona = form.cardHolder ? selectRandomDemoPersona() : getCurrentDemoPersona();
    setForm(demoPersona.payment);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-charcoal">
          Payment Details
        </h2>
        <button
          type="button"
          onClick={handleFillDemo}
          className="rounded-lg bg-oolong/10 px-3 py-1.5 text-xs font-medium text-oolong transition-colors hover:bg-oolong/20"
        >
          Fill Demo Data
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-2 rounded-lg bg-matcha/5 px-4 py-3">
        <span className="text-matcha">
          <LockIcon />
        </span>
        <p className="text-xs text-charcoal/60">
          This is a demo store. No real payment will be processed.
        </p>
      </div>

      {/* Card number */}
      <div>
        <label
          htmlFor="cardNumber"
          className="mb-1 block text-sm font-medium text-charcoal"
        >
          Card Number
        </label>
        <div className="relative">
          <input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            value={form.cardNumber}
            onChange={(e) => { updateField('cardNumber', formatCardNumber(e.target.value)); }}
            placeholder="1234 5678 9012 3456"
            className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm text-charcoal placeholder:text-charcoal/40 transition-colors focus:outline-none focus:ring-1 ${
              errors.cardNumber
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                : 'border-sage bg-cream/50 focus:border-matcha focus:ring-matcha'
            }`}
          />
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <CreditCardIcon />
          </div>
        </div>
        {errors.cardNumber && (
          <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry + CVC row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="expiry"
            className="mb-1 block text-sm font-medium text-charcoal"
          >
            Expiry Date
          </label>
          <input
            id="expiry"
            type="text"
            inputMode="numeric"
            value={form.expiry}
            onChange={(e) => { updateField('expiry', formatExpiry(e.target.value)); }}
            placeholder="MM/YY"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 transition-colors focus:outline-none focus:ring-1 ${
              errors.expiry
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                : 'border-sage bg-cream/50 focus:border-matcha focus:ring-matcha'
            }`}
          />
          {errors.expiry && (
            <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="cvc"
            className="mb-1 block text-sm font-medium text-charcoal"
          >
            CVC
          </label>
          <input
            id="cvc"
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={form.cvc}
            onChange={(e) => { updateField('cvc', e.target.value.replace(/\D/g, '').slice(0, 4)); }}
            placeholder="123"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 transition-colors focus:outline-none focus:ring-1 ${
              errors.cvc
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                : 'border-sage bg-cream/50 focus:border-matcha focus:ring-matcha'
            }`}
          />
          {errors.cvc && (
            <p className="mt-1 text-xs text-red-600">{errors.cvc}</p>
          )}
        </div>
      </div>

      {/* Card holder */}
      <div>
        <label
          htmlFor="cardHolder"
          className="mb-1 block text-sm font-medium text-charcoal"
        >
          Card Holder Name
        </label>
        <input
          id="cardHolder"
          type="text"
          value={form.cardHolder}
          onChange={(e) => { updateField('cardHolder', e.target.value); }}
          placeholder="Name on card"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 transition-colors focus:outline-none focus:ring-1 ${
            errors.cardHolder
              ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
              : 'border-sage bg-cream/50 focus:border-matcha focus:ring-matcha'
          }`}
        />
        {errors.cardHolder && (
          <p className="mt-1 text-xs text-red-600">{errors.cardHolder}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" size="lg">
          Continue to Review
        </Button>
      </div>
    </form>
  );
}
