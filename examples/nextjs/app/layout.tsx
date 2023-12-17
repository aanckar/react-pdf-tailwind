import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js example",
  description: "Example of react-pdf-tailwind in Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
