import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#C1F0E7] w-full py-6 text-center text-[#6B7D90] text-lg mt-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section - Logo & Copyright */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Nest Market</h2>
          <p className="text-sm">© {new Date().getFullYear()} Nest Market. All rights reserved.</p>
        </div>

        {/* Center - Quick Links */}
        <div className="flex space-x-6 text-[#6B7D90]">
          <a href="/about" className="hover:text-[#3DD0B1]">About</a>
          <a href="/contact" className="hover:text-[#3DD0B1]">Contact</a>
          <a href="/privacy" className="hover:text-[#3DD0B1]">Privacy Policy</a>
        </div>

        {/* Right Section - Social Media Icons */}
        <div className="flex space-x-4 text-2xl">
          <a href="#" className="hover:text-[#3DD0B1]"><FaFacebook /></a>
          <a href="#" className="hover:text-[#3DD0B1]"><FaTwitter /></a>
          <a href="#" className="hover:text-[#3DD0B1]"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
}
