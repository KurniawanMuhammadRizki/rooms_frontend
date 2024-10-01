"use client";

import React from "react";
import logo from "../public/logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MobileNavMenu from "./MobileNavMenu";
import DesktopNavMenu from "./DesktopNavMenu";

const Navbar: React.FC = () => {
  const pathName = usePathname();
  const excludedPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/delete-account",
    "/dashboard",
  ];

  if (excludedPaths.includes(pathName)) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm ">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-20 lg:px-[130px]">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Image
              className={"w-[130px] h-fit"}
              src={logo}
              alt={"logo.png"}></Image>
          </div>
          <DesktopNavMenu />
          <MobileNavMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
