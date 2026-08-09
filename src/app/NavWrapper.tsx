'use client';

import { usePathname } from 'next/navigation';
import AfterAuthnav from './AfterAuthnav';

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show AfterAuthnav on '/', '/auth/login', or the full-screen IDE
  const showNav =
    pathname !== '/' &&
    pathname !== '/auth/login' &&
    pathname !== '/ide';

  return (
    <>
      {showNav && <AfterAuthnav />}
      {children}
    </>
  );
}
