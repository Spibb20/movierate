import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RentalProvider } from "@/lib/rental-store";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "MovieRate.mn - Кино мэдээлэл, үнэлгээ",
    template: "%s | MovieRate.mn",
  },
  description:
    "Кино хайх, үнэлгээ өгөх, трейлэр үзэх, сэтгэгдэл бичих платформ.",
  openGraph: {
    title: "MovieRate.mn - Кино мэдээлэл, үнэлгээ",
    description:
      "Кино хайх, үнэлгээ өгөх, трейлэр үзэх, сэтгэгдэл бичих платформ.",
    images: ["/placeholder-logo.png"],
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
  );
}
