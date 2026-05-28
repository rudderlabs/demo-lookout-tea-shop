'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/shared/Button';
import { selectRandomDemoPersona } from '@/data/demo-personas';
import {
  trackCheckoutStepCompleted,
  trackCheckoutStepViewed,
  useRudderAnalytics,
} from '@/lib/analytics';

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingFormProps {
  onComplete: (data: ShippingData) => void;
  checkoutId: string;
}

const EMPTY_SHIPPING: ShippingData = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
};

export function ShippingForm({
  onComplete,
  checkoutId,
}: ShippingFormProps): React.JSX.Element {
  const [form, setForm] = useState<ShippingData>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});
  const analytics = useRudderAnalytics();

  useEffect(() => {
    if (analytics) {
      trackCheckoutStepViewed(analytics, {
        checkout_id: checkoutId,
        step: 1,
        step_name: 'Shipping',
      });
    }
  }, [analytics, checkoutId]);

  function updateField(field: keyof ShippingData, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof ShippingData, string>> = {};

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (!validate()) return;

    if (analytics) {
      trackCheckoutStepCompleted(analytics, {
        checkout_id: checkoutId,
        step: 1,
        step_name: 'Shipping',
      });
    }

    onComplete(form);
  }

  function handleFillDemo(): void {
    setForm(selectRandomDemoPersona().shipping);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-charcoal">
          Shipping Address
        </h2>
        <button
          type="button"
          onClick={handleFillDemo}
          className="rounded-lg bg-oolong/10 px-3 py-1.5 text-xs font-medium text-oolong transition-colors hover:bg-oolong/20"
        >
          Fill Demo Data
        </button>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="First Name"
          id="firstName"
          value={form.firstName}
          error={errors.firstName}
          onChange={(val) => { updateField('firstName', val); }}
        />
        <FormField
          label="Last Name"
          id="lastName"
          value={form.lastName}
          error={errors.lastName}
          onChange={(val) => { updateField('lastName', val); }}
        />
      </div>

      <FormField
        label="Email"
        id="email"
        type="email"
        value={form.email}
        error={errors.email}
        onChange={(val) => { updateField('email', val); }}
      />

      <FormField
        label="Address"
        id="address"
        value={form.address}
        error={errors.address}
        onChange={(val) => { updateField('address', val); }}
      />

      {/* City / State / ZIP row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="City"
          id="city"
          value={form.city}
          error={errors.city}
          onChange={(val) => { updateField('city', val); }}
        />
        <FormField
          label="State"
          id="state"
          value={form.state}
          error={errors.state}
          onChange={(val) => { updateField('state', val); }}
        />
        <FormField
          label="ZIP Code"
          id="zipCode"
          value={form.zipCode}
          error={errors.zipCode}
          onChange={(val) => { updateField('zipCode', val); }}
        />
      </div>

      <FormField
        label="Country"
        id="country"
        value={form.country}
        error={errors.country}
        onChange={(val) => { updateField('country', val); }}
      />

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" size="lg">
          Continue to Payment
        </Button>
      </div>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function FormField({
  label,
  id,
  type = 'text',
  value,
  error,
  onChange,
}: FormFieldProps): React.JSX.Element {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-charcoal">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 transition-colors focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
            : 'border-sage bg-cream/50 focus:border-matcha focus:ring-matcha'
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
