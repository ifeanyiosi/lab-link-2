"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { Menu as MenuIcon, X } from "lucide-react";
import RightSidebar from "@/components/RightSidebar";
import { useRouter } from "next/navigation";

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
  const { user, loading, logout } = useAuth();

  // Important: Mount state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  // Only initialize sidebar state after component is mounted
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle auth redirects after component is mounted
  useEffect(() => {
    if (isMounted && !loading && !user) {
      router.replace("/sign-in");
    }
  }, [user, loading, router, isMounted]);

  // For SSR and while loading, show a consistent loading state
  if (!isMounted || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-primary"></div>
      </div>
    );
  }

  const role = user?.role;

  // Make sure we have a role
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg">User role not found</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const menuItems: MenuSection[] = [
    {
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/patient",
          visible: ["patient"],
        },
        {
          icon: "/calendar.png",
          label: "Schedule Appointment",
          href: "/patient/appointment/create-appointment",
          visible: ["patient"],
        },
        {
          icon: "/time.png",
          label: "My Appointments",
          href: "/patient/appointment/appointments/",
          visible: ["patient"],
        },
        {
          icon: "/result.png",
          label: "Test Results",
          href: "/patient/test-results/",
          visible: ["patient"],
        },
        {
          icon: "/home.png",
          label: "Home",
          href: "/lab",
          visible: ["lab"],
        },
        {
          icon: "/time.png",
          label: "My Appointments",
          href: "/lab/appointments/",
          visible: ["lab"],
        },
        {
          icon: "/beaker.png",
          label: "Test Orders",
          href: "/lab/test/",
          visible: ["lab"],
        },
        {
          icon: "/settings.png",
          label: "Settings",
          href: "/patient/settings",
          visible: ["admin", "doctor", "patient", "lab"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: "/faq.png",
          label: "Support & FAQs",
          href: "/patient/support",
          visible: ["admin", "doctor", "patient", "lab"],
        },
      ],
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Only render the main UI after client-side hydration is complete
  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-50 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icons/lab-link-logo.png"
            alt="logo"
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
            src="/icons/lab-link-logo.png"
            alt="logo"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="font-bold text-lg">Lablink</span>
        </div>

        <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          {menuItems.map((section, idx) => (
            <div
              key={section.title || `section-${idx}`}
              className="flex flex-col py-4"
            >
              {section.title && (
                <span className="px-4 text-gray-400 font-light text-sm my-2">
                  {section.title}
                </span>
              )}
              {section.items.map(
                (item) =>
                  item.visible.includes(role) && (
                    <Link
                      key={`${item.label}-${item.href}`}
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
              alt="logout"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:flex overflow-hidden h-screen pt-14 lg:pt-0 bg-[#F7F8FA]">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 overflow-y-auto">{children}</div>
              <div className="w-full lg:w-1/3">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile - Only render after hydration */}
      {isMounted && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
