import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "मराठी टायपिंग (Marathi InScript Typing Academy)",
  description: "Learn Marathi InScript touch typing fast with an English keyboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
