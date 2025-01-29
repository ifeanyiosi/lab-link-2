import {
  Calendar,
  FileCheck,
  FileText,
  FlaskConical,
  LayoutDashboard,
  MapPin,
  MessagesSquare,
  PersonStanding,
  ScrollText,
  ShoppingBasket,
  User2,
} from "lucide-react";

export const navLinks = [
  {
    name: "About",
    href: "/about",
  },
  {
    name: "News",
    href: "/news",
  },
  {
    name: "Careers",
    href: "/careers",
  },
];

export const individualPatientTab = [
  {
    name: "Find a Lab",
    href: "/",
    icon: MapPin,
  },
  {
    name: "View Test Results",
    href: "/",
    icon: ScrollText,
  },
  {
    name: "Shop for Tests",
    href: "/",
    icon: ShoppingBasket,
  },
];

export const providerTab = [
  {
    name: "Test Menu",
    href: "/",
    icon: FlaskConical,
  },
  {
    name: "Provider Login",
    href: "/",
    icon: User2,
  },
  {
    name: "Contact Us",
    href: "/",
    icon: MessagesSquare,
  },
];
