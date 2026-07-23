import { LoginForm } from '@/components/login-form'


export default function Page() {
  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-slate-950 p-6 md:p-10">
      <div className="absolute inset-x-0 top-0 h-2 bg-yellow-400" />
      <div className="absolute left-0 top-2 h-56 w-1/3 bg-blue-600/20" />
      <div className="relative w-full max-w-sm border border-white/10 bg-white p-2 shadow-2xl shadow-black/40">
        <div className="border-l-4 border-yellow-400 p-4 sm:p-6">
        <LoginForm/>
        </div>
      </div>
    </main>
  )
}
