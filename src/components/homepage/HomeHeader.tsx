/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

import { Button } from "../ui/button";
import { unstable_noStore as noStore } from "next/cache";
import MobileMenu from "./MobileMenu";

export default async function HomeHeader() {
  noStore();
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          href={"/"}
          className="flex items-center text-2xl font-bold text-primary space-x-2"
        >
          <img
            className="h-[50px] w-[50px] "
            src="/lab-link-logo.png"
            alt="Lab Link Logo"
          />
          Lab Link
        </Link>
        <div className="flex lg:hidden">
          <MobileMenu />
        </div>
        <div className="space-x-4 hidden lg:flex ">
          <Button asChild variant="ghost">
            <Link href={"/about"}>About</Link>
          </Button>
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
