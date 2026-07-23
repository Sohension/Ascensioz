'use client'

import { useRouter } from 'next/navigation'
import { Rajdhani } from 'next/font/google'

import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export function LogoutButton() {
  const router = useRouter()


  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return <Button className={`${rajdhani.className} hover:cursor-pointer`} onClick={logout}>Logout</Button>
}
