/* eslint-disable @next/next/no-img-element */
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
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
        icon: "/file.png",
        label: "Medical Records",
        href: "/patient/records/",
        visible: ["patient"],
      },
      {
        icon: "/messages.png",
        label: "Messages",
        href: "/patient/messages/",
        visible: ["patient"],
      },

      {
        icon: "/location.png",
        label: "Find a Lab",
        href: "/list/labs/",
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
        icon: "/result.png",
        label: "Results Processing",
        href: "/lab/test/",
        visible: ["lab"],
      },
      {
        icon: "/inventory.png",
        label: "Inventory Management ",
        href: "/lab/test/",
        visible: ["lab"],
      },
      {
        icon: "/messages.png",
        label: "Messages",
        href: "/lab/messages/",
        visible: ["lab"],
      },
      {
        icon: "/settings.png",
        label: "Settings",
        href: "/settings",
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
        href: "/profile",
        visible: ["admin", "doctor", "patient", "lab"],
      },
      {
        icon: "/settings.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "doctor", "patient", "lab"],
      },
    ],
  },
];

const Menu = () => {
  const { user, loading, logout } = useAuth();
  const role = user?.role || "";

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <div className=" flex flex-col overflow-y-auto min-h-screen text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-10 py-8" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image
                    className="w-[50px]"
                    src={item.icon}
                    alt={item.label}
                    width={50}
                    height={50}
                  />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null; // Explicitly return null for non-visible items
          })}
        </div>
      ))}

      <div className="py-8 hidden lg:block w-full">
        <button
          className="flex w-f hover:bg-primary hover:text-white p-2 w-full items-center gap-2"
          onClick={logout}
          type="button"
        >
          <Image
            width={20}
            height={20}
            className="h-[20px] w-[20px] "
            src="/logout.png"
            alt="logout button"
          />{" "}
          <span className="">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Menu;
