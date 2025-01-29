"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const Homepage = () => {
  return (
    <div className="flex items-center gap-4">
      <Link href={"/sign-up"}>Sign up as a patient</Link>
      <Link href={"/lab-sign-up"}>Sign up as a Lab</Link>
      <Link href={"/sign-in"}>Sign in</Link>
    </div>
  );
};

export default Homepage;
