
/* 
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/server'
*/

import AfterAuthnav from '@/components/big-components/AfterAuthnav'


export default async function ProtectedPageHome() {
/*   const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  return (
    <div className="flex text-black h-svh w-full items-center justify-center gap-2">
      <p className='text-black'>
        Hello, <span>{data.claims.email}</span>
      </p>
      <LogoutButton />
    </div>
  )
  */

  return(
    <>
      <AfterAuthnav/>
    </>
  )
}
