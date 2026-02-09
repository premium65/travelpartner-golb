import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically
  const adminPanelUrl = process.env.NEXT_PUBLIC_ADMIN_PANEL_URL || "https://travelpartner-admin-panel.onrender.com";
  
  return (
      <footer className="bg-[#ec742b]">
            <div className="container mx-auto ">
        <div className="text-sm w-full text-center text-white p-5 font-semibold">
          <p>© Copyright {currentYear}, GoIb.tech, All Rights Reserved</p>
          <div className="mt-2">
            <a 
              href={adminPanelUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200 underline text-xs"
            >
              Admin Panel
            </a>
          </div>
        </div>
        </div>
      </footer>
  );
};

export default Footer;
