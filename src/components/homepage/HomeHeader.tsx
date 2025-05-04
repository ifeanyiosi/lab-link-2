"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import { Button } from "../ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Prevent scrolling when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-black/30 backdrop-blur-lg shadow-lg border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1500px] mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          className="flex gap-2 text-white items-center uppercase font-bold text-secondary z-50"
          href="/"
        >
          <img
            className="h-[50px] w-[50px]"
            src="/lab-link-logo.png"
            alt="Lab Link Logo"
          />
          Lab Link
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4">
          <ul className="hidden md:flex items-center gap-8 text-white font-medium">
            {navItems.map(({ name, link }) => (
              <li key={name} className="relative flex items-center group">
                <Link
                  href={link}
                  className={clsx(
                    "hover:text-primary transition-colors duration-300",
                    pathname === link && "text-primary"
                  )}
                >
                  {name}
                </Link>
                <span
                  className={clsx(
                    "absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full",
                    pathname === link ? "w-full" : "w-0"
                  )}
                ></span>
              </li>
            ))}
          </ul>

          <Button asChild>
            <Link href="/sign-in" className="text-white">
              Book a Test
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white relative z-50 p-2"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-8 h-8">
            <span
              className={clsx(
                "absolute block w-8 h-0.5 bg-white transform transition-all duration-300",
                isOpen ? "rotate-45 top-4" : "top-2"
              )}
            ></span>
            <span
              className={clsx(
                "absolute block w-8 h-0.5 bg-white transform transition-all duration-300",
                isOpen ? "opacity-0" : "opacity-100 top-4"
              )}
            ></span>
            <span
              className={clsx(
                "absolute block w-8 h-0.5 bg-white transform transition-all duration-300",
                isOpen ? "-rotate-45 top-4" : "top-6"
              )}
            ></span>
          </div>
        </button>
      </div>

      {/* Enhanced Mobile Menu with Slide-in Animation */}
      <div
        className={clsx(
          "fixed z-[100] md:hidden inset-0 bg-black/80 backdrop-blur-lg transition-all duration-500 ease-in-out",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={closeMenu}
      >
        <div
          className={clsx(
            "absolute right-0 top-0 h-full w-4/5 max-w-sm bg-gradient-to-b from-gray-900 to-black p-6 pt-24 transition-transform duration-500 ease-in-out shadow-xl",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <ul className="flex flex-col space-y-2">
                {navItems.map(({ name, link }) => (
                  <li
                    key={name}
                    className={clsx(
                      "transform transition-all duration-300 delay-100",
                      isOpen
                        ? "translate-x-0 opacity-100"
                        : "translate-x-8 opacity-0"
                    )}
                  >
                    <Link
                      href={link}
                      className={clsx(
                        "flex items-center justify-between p-4 rounded-lg transition-all duration-300",
                        pathname === link
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-white hover:bg-white/5"
                      )}
                      onClick={closeMenu}
                    >
                      <span className="text-lg">{name}</span>
                      <ChevronRight
                        size={18}
                        className={
                          pathname === link ? "text-primary" : "text-gray-400"
                        }
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
