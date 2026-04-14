'use client';

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Content() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const success = status === "success";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full border rounded-xl p-8 text-center shadow-sm">

        <h1 className="text-2xl font-semibold mb-3">
          {success ? "Subscription Confirmed" : "Confirmation failed"}
        </h1>

        <p className="text-sm text-neutral-600 mb-6">
          {success
            ? "You're now subscribed and will receive updates when new blogs or projects are published."
            : "Invalid or expired confirmation link."
          }
        </p>

        {success && (
          <div className="space-y-3">
            <Link href="/blog" className="block border rounded-md py-2">
              Read Latest Blogs
            </Link>

            <Link href="/projects" className="block border rounded-md py-2">
              View Projects
            </Link>

            <Link href="/services" className="block border rounded-md py-2">
              Explore Services
            </Link>

            <Link
              href="/"
              className="block border rounded-md py-2 bg-black text-white"
            >
              Go to Homepage
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Content />
    </Suspense>
  );
}