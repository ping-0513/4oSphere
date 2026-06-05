import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "4oSphere",
  description: "GPT-4o-focused web app foundation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
