"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  reviewUrl: string;
  partnerName: string;
}

export default function StickyReviewCTA({ reviewUrl, partnerName }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("partner-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
      style={{
        background: "rgba(3,8,24,0.96)",
        borderTop: "1px solid rgba(117,159,188,0.2)",
        backdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <p className="flex-1 text-sm font-medium text-white truncate">
          {partnerName}
        </p>
        <Link
          href={reviewUrl}
          className="shrink-0 text-sm font-semibold px-5 py-2.5 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #1f5673, #759fbc)",
            color: "white",
            boxShadow: "0 2px 12px rgba(31,86,115,0.45)",
          }}
        >
          Write a review
        </Link>
      </div>
    </div>
  );
}
