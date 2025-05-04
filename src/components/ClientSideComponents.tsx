"use client";

import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import InstallPWA from "./InstallPWA";

export default function ClientSideComponents() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Analytics />
      <InstallPWA />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
