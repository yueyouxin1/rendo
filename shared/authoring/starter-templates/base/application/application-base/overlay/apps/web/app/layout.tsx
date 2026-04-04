import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Rendo AI Web Starter",
  description: "Next.js + FastAPI cross-language starter",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
