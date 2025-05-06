"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { Menu as MenuIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import LabRightSidebar from "@/components/LabRightSidebar";

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  visible: string[];
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  // Avoid hydration mismatch by rendering only after mount
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !loading && !user) {
      router.replace("/sign-in");
    }
  }, [hydrated, user, loading, router]);

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const role = user.role || "";

  const labMenuItems: MenuSection[] = [
    {
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/lab",
          visible: ["lab"],
        },
        {
          icon: "/time.png",
          label: "Appointments",
          href: "/lab/appointments",
          visible: ["lab"],
        },
        {
          icon: "/beaker.png",
          label: "Test Orders",
          href: "/lab/test-orders",
          visible: ["lab"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: "/faq.png",
          label: "Support & FAQs",
          href: "/lab/support",
          visible: ["lab"],
        },
      ],
    },
  ];

  const menuItems = role === "lab" ? labMenuItems : [];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-50 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/lab-link-logo.png"
            alt="Lablink logo"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="font-bold text-lg">Lablink</span>
        </Link>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-full bg-white z-40 
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 w-64 lg:w-[16%] xl:w-[14%] shadow-lg lg:shadow-none
          flex flex-col`}
      >
        <div className="hidden lg:flex items-center gap-2 p-4 border-b">
          <Image
            src="/lab-link-logo.png"
            alt="Lablink logo"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="font-bold text-lg">Lablink</span>
        </div>

        <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          {menuItems.map((section, idx) => (
            <div key={section.title || idx} className="flex flex-col py-4">
              {section.title && (
                <span className="px-4 text-gray-400 font-light text-sm my-2">
                  {section.title}
                </span>
              )}
              {section.items.map(
                (item) =>
                  item.visible.includes(role) && (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t mt-auto">
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 hover:bg-primary hover:text-white rounded-lg transition-colors"
          >
            <Image
              src="/logout.png"
              alt="Logout"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:flex overflow-hidden h-screen pt-14 lg:pt-0 bg-[#F7F8FA]">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
