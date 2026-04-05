import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Rendo Application Base Starter",
  description: "Next.js canonical base starter for multi-surface interface applications",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
