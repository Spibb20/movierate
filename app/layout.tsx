import type { Metadata } from "next"
import { Inter, Space_Mono } from "next/font/google"

import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RentalProvider } from "@/lib/rental-store"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "MovieRate.mn - Кино мэдээлэл, үнэлгээ",
  description:
    "Кино хайх, үнэлгээ өгөх, трейлэр үзэх, сэтгэгдэл бичих платформ.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn">
      <body className="font-sans antialiased">
        <RentalProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </RentalProvider>
      </body>
    </html>
  )
}
