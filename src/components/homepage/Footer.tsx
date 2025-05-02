/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "../ui/button";


const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="relative bg-[#001C3D] text-gray-300">
      {/* Background image container with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/footer.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
        }}
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="relative container px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info and Contact */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white uppercase">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <img
                      src="/lab-link-logo.png"
                      alt="Company Logo"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h1 className="text-xl uppercase hidden lg:flex font-bold text-white hover:text-blue-400 transition-colors">
                    Lab Link
                  </h1>
                </Link>
              </h2>
              <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                We are committed to excellence in every aspect of our healthcare
                services, maintaining the highest standards in patient care,
                treatment, and well-being.
              </p>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-white uppercase after:content-[''] after:block after:w-12 after:h-1 after:bg-blue-400 after:mt-2">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-blue-400 transition-colors inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
              <p className="text-sm text-gray-400">08058765439</p>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <Link
                href="mailto:healthesphere@gmail.com"
                className="text-sm hover:text-blue-400 transition-colors"
              >
                healthesphere@gmail.com
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section with enhanced border */}
        <div className="mt-16 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Lab Link. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <Button
        variant="secondary"
        size="icon"
        className={`fixed bottom-6 right-6 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </footer>
  );
};

export default Footer;
