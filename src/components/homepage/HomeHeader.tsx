import Link from "next/link";
import React from "react";

import { Button } from "../ui/button";
import { unstable_noStore as noStore } from "next/cache";
import MobileMenu from "./MobileMenu";
import { navLinks } from "@/constants";
import { Stethoscope } from "lucide-react";

export default async function HomeHeader() {
  noStore();
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <Stethoscope className="text-primary" size={32} />
          <span className="text-2xl font-bold text-primary">Lab Link</span>
        </div>
        <div className="space-x-4">
          <Button asChild variant="ghost">
            <Link href={"/sign-in"}>Login</Link>
          </Button>
          <Button asChild>
            <Link href={"/sign-up"}>Sign up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
