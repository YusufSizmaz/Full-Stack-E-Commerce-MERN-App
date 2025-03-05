import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-gray-300">
      <div className="container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-4">
        <p>&copy; All Rights Reserved 2025</p>

        <div className="flex items-center gap-4 justify-center text-2xl">
          <a href="" className="hover:text-amber-300">
            <FaFacebook />
          </a>

          <a href="" className="hover:text-amber-300">
            <FaInstagram />
          </a>

          <a href="" className="hover:text-amber-300">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
