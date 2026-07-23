import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Montserrat, Rajdhani } from "next/font/google"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams

  return (
    <main className={`${rajdhani.className} flex min-h-svh w-full items-center justify-center bg-slate-950 p-6 md:p-10`}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="rounded-lg border-white/10 bg-white shadow-2xl shadow-black/40">
            <CardHeader className="border-l-4 border-yellow-400">
              <CardTitle className={`${montserrat.className} text-2xl text-slate-950`}>Sorry, something went wrong.</CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">Code error: {params.error}</p>
              ) : (
                <p className="text-sm text-muted-foreground">An unspecified error occurred.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
