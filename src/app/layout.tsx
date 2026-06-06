import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "4oSphere",
  description: "GPT-4o に特化したチャットアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
