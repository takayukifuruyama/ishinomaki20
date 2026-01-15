import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "どこでもランキング",
  description: "誰でも自由にランキングを作成・参加できる地域密着型コミュニティアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-gray-50 font-sans">
        {children}
      </body>
    </html>
  );
}
