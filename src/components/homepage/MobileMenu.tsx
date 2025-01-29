import React from "react";

import { navLinks } from "@/constants";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";



export default async function MobileMenu() {


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu />
      </SheetTrigger>
      <SheetContent className="w-full bg-blue">
        <div className="flex flex-col items-start text-xl justify-center pt-5 pb-7 gap-4">
          {navLinks.map((item, index) => (
            <React.Fragment key={item.name}>
              <SheetClose asChild>
                <Link className="text-white py-2" href={item.href} passHref>
                  {item.name}
                </Link>
              </SheetClose>
              {index < navLinks.length - 1 && (
                <Separator className="bg-white/20 w-full" />
              )}
            </React.Fragment>
          ))}
         
        </div>
      </SheetContent>
    </Sheet>
  );
}
