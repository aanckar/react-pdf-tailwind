import type { Metadata } from "next";

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
      <body className="max-w-6xl my-4 mx-auto">{children}</body>
    </html>
  );
}
