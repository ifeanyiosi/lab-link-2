
import Link from "next/link";
import React from "react";

import { Button } from "../ui/button";
import { unstable_noStore as noStore } from "next/cache";
import MobileMenu from "./MobileMenu";
import { navLinks } from "@/constants";

export default async function HomeHeader() {
  noStore();
  return (
    <nav className="bg-white shadow-md px-4 py-2 md:py-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href={"/"} className="text-lg font-bold text-blue">
          Lab Link
        </Link>

        <div className="flex lg:hidden">
          <MobileMenu />
        </div>
        <div className="lg:flex justify-between items-center gap-[100px] hidden">
          <div className="flex gap-4 ">
            {navLinks.map((item) => (
              <Link
                className="text-base text-blue border-b-2 border-transparent hover:border-primary transition-all duration-300 ease-in-out hover:text-primary"
                key={item.href}
                href={item.href}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
