"use client";

import React from "react";
import Link from "next/link";
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from "react-icons/fi";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-lg mb-4 text-gray-900">Lab Link</h4>
            <p className="text-gray-600 text-sm mb-6">
              Revolutionizing healthcare connectivity through innovative
              technology solutions for patients and laboratories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Patients */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Patients</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/sign-up"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/results"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  View Results
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Patient FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Laboratories */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Laboratories</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/lab-sign-up"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Lab Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/integration"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  System Integration
                </Link>
              </li>
              <li>
                <Link
                  href="/lab-services"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/api-docs"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Developer API
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600 hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} Lab Link. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link
                href="/sitemap"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Sitemap
              </Link>
              <Link
                href="/accessibility"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
