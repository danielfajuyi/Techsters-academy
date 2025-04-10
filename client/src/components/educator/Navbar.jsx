import React from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";


const Navbar = () => {
  const educatorData = dummyEducatorData;
  const {user} = useUser()
  return (
    <div className="flex item-center justify-between px-4 md:px-8 border-b border-gray-500 py-3 bg-navbar-bg">
      <Link to={'/'}>
        <img src={assets.techsters_logo} alt="logo" className="w-14 lg:w-20" />
      </Link>
      <div className="flex items-center gap-5 text-text-color relative">
        <p>Hi! {user ? user.fullName : 'Developers'}</p>
        {user ? <UserButton /> : <img className="max-w-8" src={assets.profile_img} />}
      </div>
    </div>
  );
};

export default Navbar;
