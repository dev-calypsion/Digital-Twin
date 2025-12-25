import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calypsion Digital Twin",
  description: "Interactive 3D digital twin viewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid #eaeaea",
            position: "sticky",
            top: 0,
            background: "var(--background)",
            zIndex: 10,
          }}
        >
          <Link href="/" style={{ fontWeight: 600, letterSpacing: "-0.5px" }}>Calypsion Digital Twin</Link>
          <nav style={{ display: "flex", gap: 16 }}>
            <Link href="/viewer">Viewer</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
