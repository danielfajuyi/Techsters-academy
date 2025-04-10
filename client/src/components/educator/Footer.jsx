import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse item-center justify-between text-left w-full px-8 border-t">
      <div className="flex items-center gap-4">
        <img
          className="hidden md:block w-10"
          src={assets.techsters_logo}
          alt="logo"
        />
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
        <p className="py-4 text-center text-xs md:text-sm text-gray-500">
          {" "}
          Copyright © 2025 Techsters. All Right Reserved.{" "}
        </p>
      </div>
      <div className="flex items-center gap-3 max-md:mt-4">
        <a href="#">
          <img
            src={assets.tech_facebook_icon}
            alt="facebook_icon "
            className="w-8"
          />
        </a>
        <a href="#">
          <img
            src={assets.tech_twitter_icon}
            alt="twitter_icon"
            className="w-8"
          />
        </a>
        <a href="#">
          <img
            src={assets.tech_instagram_icon}
            alt="instagram_icon "
            className="w-8"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
