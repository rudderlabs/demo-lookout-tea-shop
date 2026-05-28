'use client';

import { type FormEvent, useState } from 'react';

import { Button } from '@/components/shared/Button';
import { selectRandomDemoPersona } from '@/data/demo-personas';
import { identifyUser, useRudderAnalytics } from '@/lib/analytics';
import { type UserProfile, generateUserId, useAuth } from '@/lib/auth/context';

function UserIcon(): React.JSX.Element {
  return (
    <svg
      className="h-16 w-16 text-matcha"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SuccessToast({ name }: { name: string }): React.JSX.Element {
  return (
    <div className="mb-6 rounded-lg border border-matcha-light/30 bg-matcha/10 px-4 py-3 text-sm text-matcha-dark">
      <span className="mr-2 font-semibold">Welcome, {name}!</span>
      Your profile has been identified.
    </div>
  );
}

function ProfileView({
  profile,
  onSignOut,
}: {
  profile: UserProfile;
  onSignOut: () => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-steam">
        <UserIcon />
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-charcoal">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="mt-1 text-sm text-charcoal/60">{profile.email}</p>
      </div>

      <div className="w-full rounded-lg bg-steam/60 px-5 py-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-charcoal/50">
          Account Details
        </h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-charcoal/60">First Name</dt>
            <dd className="font-medium text-charcoal">{profile.firstName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal/60">Last Name</dt>
            <dd className="font-medium text-charcoal">{profile.lastName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal/60">Email</dt>
            <dd className="font-medium text-charcoal">{profile.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal/60">User ID</dt>
            <dd className="font-mono text-xs text-charcoal/80">
              {profile.userId}
            </dd>
          </div>
        </dl>
      </div>

      <Button variant="outline" size="md" onClick={onSignOut} className="w-full">
        Sign Out
      </Button>
    </div>
  );
}

export function LoginForm(): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);

  function handleFillDemo(): void {
    const persona = selectRandomDemoPersona();
    setEmail(persona.account.email);
    setFirstName(persona.account.firstName);
    setLastName(persona.account.lastName);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const userId = generateUserId(email);

    if (analytics) {
      identifyUser(analytics, userId, {
        email,
        name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
      });
    }

    auth.login({ email, firstName, lastName, userId });
    setShowSuccess(true);
  }

  function handleSignOut(): void {
    auth.logout();
    setShowSuccess(false);
    setEmail('');
    setFirstName('');
    setLastName('');
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-sage/60 bg-white px-8 py-10 shadow-lg shadow-charcoal/5">
      {showSuccess && auth.user && (
        <SuccessToast name={auth.user.firstName} />
      )}

      {auth.user ? (
        <ProfileView profile={auth.user} onSignOut={handleSignOut} />
      ) : (
        <>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-matcha/10">
              <svg
                className="h-8 w-8 text-matcha"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.71c.79.14 1.6.21 2.34.21 5.05 0 9.88-3.71 11.45-9.5l.1-.35-.35-.1C18.48 9.07 17 8.35 17 8zm-5.24 9.5c-.82 0-1.68-.12-2.5-.34C10.82 14.28 12.34 12 15 10.5c-2.16 1.5-3.5 3.62-4.24 5.77V16c0-4.5 3-8.5 8-10-.17.5-.62 1.33-1.34 2.5-.71 1.16-1.82 2.5-3.33 3.67-.24.8-.4 1.5-.47 2.08-.1.5-.14.87-.14 1.25h-.72z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-charcoal">
              Welcome Back
            </h2>
            <p className="mt-1 text-sm text-charcoal/60">
              Sign in to your Tea Leafs account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-charcoal/80"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-sage bg-steam/40 px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1.5 block text-sm font-medium text-charcoal/80"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  className="w-full rounded-lg border border-sage bg-steam/40 px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/20"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1.5 block text-sm font-medium text-charcoal/80"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Chen"
                  className="w-full rounded-lg border border-sage bg-steam/40 px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/20"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="mt-2 w-full">
              Sign In
            </Button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sage/60" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-charcoal/40">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full rounded-lg border border-dashed border-oolong/40 px-4 py-2.5 text-sm font-medium text-oolong transition-colors hover:border-oolong hover:bg-oolong/5"
            >
              Fill Demo Data
            </button>
          </form>
        </>
      )}
    </div>
  );
}
