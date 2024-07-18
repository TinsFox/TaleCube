import '@/app/globals.css'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Providers as RQProviders } from './providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { Footer } from '@/components/layout/Footer'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={'antialiased'}>
        <RQProviders>
          <Toaster position="top-center" richColors />
          <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex h-screen flex-col">
              <Header />
              <main className="flex flex-1 flex-col">
                {children}
                <Footer />
              </main>
            </div>
            <TailwindIndicator />
          </Providers>
        </RQProviders>
      </body>
    </html>
  )
}
