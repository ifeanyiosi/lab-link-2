import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import Link from "next/link";

interface NavbarProps {
  name: string;
  role: "Doctor" | "Patient" | "Admin";
}

const Navbar = ({ name, role }: NavbarProps) => {
  const { logout } = useAuth();

  return (
    <div className="flex items-center justify-between p-4 lg:px-8">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image
                src="/icons/avatar.png"
                alt="avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="uppercase">
                {name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={"/patient/profile"}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <Button asChild onClick={logout}>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 text-right">{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
