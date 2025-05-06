"use client"; // Add this if you're using Next.js App Router

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // Optional: using Lucide for icon
import React from "react";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="text-sm">Back</span>
    </button>
  );
};

export default BackButton;
