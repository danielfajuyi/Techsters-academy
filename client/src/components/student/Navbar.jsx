import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import UserDrawer from "./UserDrawer";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { navigate, isEducator, setIsEducator, getToken, backendUrl } = useContext(AppContext);
  const { user } = useUser();
  const { openSignIn, openSignUp } = useClerk();
  const isCourseListPage = location.pathname.includes("/course-list");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const becomeEducator = async () => {
    if (isEducator) return navigate("/educator");
    try {
      const token = await getToken();
      const res = await fetch(`${backendUrl}/api/educator/update-role`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setIsEducator(true);
      }
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? "bg-navbar-bg" : "bg-navbar-bg"}`}
    >
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.techsters_logo}
        alt="Logo"
        className="w-14 lg:w-20 cursor-pointer"
      />

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-5 text-text-color">
        {user && (
          <>
            <button onClick={becomeEducator}>
              {isEducator ? "Educator Dashboard |" : "Become Educator |"}
            </button>
            <Link to="/my-enrollments">My Enrollments</Link>
          </>
        )}

        {user ? (
          <UserButton />
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => openSignIn()}
              className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-50"
            >
              Sign In
            </button>
            <button
              onClick={() => openSignUp()}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
              Create Account
            </button>
          </div>
        )}
      </div>

      {/* Burger Icon for Mobile */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
        >
          <Menu className="text-2xl" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full z-50">
          <UserDrawer closeDrawer={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
