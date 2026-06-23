import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Leave a Review — VCGlassdoor",
};

export default function SubmitPage() {
  const tallyUrl = process.env.NEXT_PUBLIC_TALLY_FORM_URL;
  if (tallyUrl) redirect(tallyUrl);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Leave a review</h1>
      <p className="text-gray-500 mb-8">
        Our review form isn&apos;t configured yet. Check back soon.
      </p>
    </div>
  );
}
