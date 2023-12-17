"use client";

import dynamic from "next/dynamic";

const ClientPdf = dynamic(() => import("./Pdf"), {
  ssr: false,
});

export default function HomePage() {
  return <ClientPdf />;
}
