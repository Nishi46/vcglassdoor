"use client";

import dynamic from "next/dynamic";

const Cursor = dynamic(() => import("@/components/Cursor"), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Cursor />
      {children}
    </SmoothScroll>
  );
}
