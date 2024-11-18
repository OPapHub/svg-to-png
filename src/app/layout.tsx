import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SVG to PNG",
  description: "Simple svg to png converter",
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
