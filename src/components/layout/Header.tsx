'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useCart } from '@/lib/cart';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Teas' },
  { href: '/cart', label: 'Cart' },
  { href: '/account', label: 'Account' },
] as const;

function LeafIcon(): React.JSX.Element {
  return (
    <svg
      className="h-7 w-7 text-matcha"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.71c.79.14 1.6.21 2.34.21 5.05 0 9.88-3.71 11.45-9.5l.1-.35-.35-.1C18.48 9.07 17 8.35 17 8zm-5.24 9.5c-.82 0-1.68-.12-2.5-.34C10.82 14.28 12.34 12 15 10.5c-2.16 1.5-3.5 3.62-4.24 5.77V16c0-4.5 3-8.5 8-10-.17.5-.62 1.33-1.34 2.5-.71 1.16-1.82 2.5-3.33 3.67-.24.8-.4 1.5-.47 2.08-.1.5-.14.87-.14 1.25h-.72z" />
    </svg>
  );
}

function CartIcon(): React.JSX.Element {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function MenuIcon(): React.JSX.Element {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon(): React.JSX.Element {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Header(): React.JSX.Element {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function toggleMenu(): void {
    setMobileMenuOpen((prev) => !prev);
  }

  function closeMenu(): void {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-sage/50 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          onClick={closeMenu}
        >
          <LeafIcon />
          <span className="text-xl font-semibold tracking-tight text-charcoal">
            Tea Leafs
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal/70 transition-colors hover:text-matcha"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Cart + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-charcoal/70 transition-colors hover:text-matcha"
            aria-label={`Cart with ${itemCount} items`}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-matcha text-[10px] font-bold text-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={toggleMenu}
            className="text-charcoal/70 transition-colors hover:text-matcha md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav
          className="border-t border-sage/50 bg-cream px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal/70 transition-colors hover:bg-steam hover:text-matcha"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
