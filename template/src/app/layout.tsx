import type { Metadata } from "next";
import "./globals.css";
import { ProtoNav } from "./proto-nav";
import { PasswordGate } from "./password-gate";

const protoTitle = process.env.NEXT_PUBLIC_PROTO_TITLE || "Prototype";

export const metadata: Metadata = {
  title: protoTitle,
  description: process.env.NEXT_PUBLIC_PROTO_DESCRIPTION || "UI Prototype with Claude Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <PasswordGate>
          <ProtoNav />
          <div className="h-[calc(100vh-40px)] overflow-y-auto">
            {children}
          </div>
        </PasswordGate>
      </body>
    </html>
  );
}
