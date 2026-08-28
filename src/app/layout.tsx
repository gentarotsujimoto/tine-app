import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tine",
  description: "匿名メッセージングアプリ Tine",
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
