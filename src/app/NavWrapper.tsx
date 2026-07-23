'use client';

import { usePathname } from 'next/navigation';
import AfterAuthnav from './AfterAuthnav';

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show AfterAuthnav on '/' or '/auth/login'
  const showNav = pathname !== '/' && pathname !== '/auth/login';

  return (
    <>
      {showNav && <AfterAuthnav />}
      {children}
    </>
  );
}
