"use client";

import { Stethoscope } from "lucide-react";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Stethoscope size={48} className="text-white" />
          <h3 className="text-2xl font-bold">Lab Link</h3>
          <p className="text-blue-200">© 2025 Lab Link. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
