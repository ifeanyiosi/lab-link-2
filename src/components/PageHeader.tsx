"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export default function PageHeader({
  title,
  showBackButton = true,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center space-x-4 mb-6 p-4 border-b">
      {showBackButton && (
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
      )}
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
    </div>
  );
}
