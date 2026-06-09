import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Muhammad Saad | Embedded Systems Engineer & FPGA Designer',
  description: 'Personal portfolio of Muhammad Saad - A Final Year Computer Engineering student at GIKI specializing in Embedded Systems, FPGA, RISC-V, and IoT.',
  keywords: ['Embedded Systems', 'FPGA', 'RISC-V', 'IoT', 'Computer Engineer', 'Hardware Architecture', 'Verilog', 'Muhammad Saad', 'GIKI'],
  authors: [{ name: 'Muhammad Saad' }],
  creator: 'Muhammad Saad',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://muhammadsaad.dev',
    title: 'Muhammad Saad | Embedded Systems Engineer & FPGA Designer',
    description: 'Final Year Computer Engineering student at GIKI specializing in Embedded Systems, FPGA, RISC-V, and IoT.',
    siteName: 'Muhammad Saad Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Saad | Embedded Systems Engineer',
    description: 'Final Year Computer Engineering student specializing in Embedded Systems, FPGA, and IoT.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f4ff' },
    { media: '(prefers-color-scheme: dark)', color: '#040D18' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
