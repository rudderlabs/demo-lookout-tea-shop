'use client';

import { LoginForm } from '@/components/account/LoginForm';
import { usePageTracking } from '@/lib/analytics';

export default function AccountPage(): React.JSX.Element {
  usePageTracking('Account');

  return (
    <section className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <LoginForm />
    </section>
  );
}
