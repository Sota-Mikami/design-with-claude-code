import type { Metadata } from "next";
import "./globals.css";
import { ProtoNav } from "./proto-nav";

export const metadata: Metadata = {
  title: "Prototype",
  description: "UI Prototype with Claude Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ProtoNav />
        <div className="h-[calc(100vh-40px)] overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
