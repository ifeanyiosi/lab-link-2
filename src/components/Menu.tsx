import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MAIN",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "doctor", "patient", "labTech"],
      },
      {
        icon: "/book.png",
        label: "Labs",
        href: "/list/labs",
        visible: ["admin"],
      },
      {
        icon: "/book.png",
        label: "Book a test",
        href: "/labs",
        visible: ["patient", "admin"],
      },
      {
        icon: "/subject.png",
        label: "My Lab Tests",
        href: "/my-tests",
        visible: ["patient", "labTech"],
      },
      {
        icon: "/calendar.png",
        label: "Appointments",
        href: "/list/appointments",
        visible: ["patient", "doctor", "admin", "labTech"],
      },
      {
        icon: "/patient.png",
        label: "Patients",
        href: "/list/patients",
        visible: ["admin"],
      },
      {
        icon: "/doctor.png",
        label: "Doctors",
        href: "/list/doctors",
        visible: ["admin"],
      },

      {
        icon: "/messages.png",
        label: "Messages",
        href: "/messages",
        visible: ["patient", "doctor", "admin", "labTech"],
      },
      {
        icon: "/subject.png",
        label: "Lab Tests",
        href: "/list/tests",
        visible: ["admin"],
      },
      {
        icon: "/subject.png",
        label: "Available Tests",
        href: "/tests",
        visible: ["patient", "doctor", "admin", "labTech"],
      },
      {
        icon: "/anat.png",
        label: "Announcements",
        href: "/list/announcement",
        visible: ["admin"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "patient"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "doctor", "patient", "labTech"],
      },
      {
        icon: "/settings.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "doctor", "patient", "labTech"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "doctor", "patient", "labTech"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-6" key={section.title}>
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
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
