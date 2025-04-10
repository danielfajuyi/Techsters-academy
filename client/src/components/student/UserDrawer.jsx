import { useState } from "react";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const UserDrawer = ({ closeDrawer }) => {
  const { user, isSignedIn } = useUser();
  const { openSignIn, openSignUp, signOut } = useClerk();
  const navigate = useNavigate();

  const goTo = (path) => {
    closeDrawer();
    navigate(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      closeDrawer();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative z-50">
      {/* Backdrop */}
      <AnimatePresence>
        <motion.div
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/40 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      </AnimatePresence>

      {/* Slide-in Panel */}
      <motion.div
        className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50 p-6 flex flex-col gap-6"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <h2 className="text-xl font-semibold">
              {user ? `Hi, ${user.firstName}` : "Welcome 👋"}
            </h2>
            <UserButton />
          </div>
          <button onClick={closeDrawer}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-gray-700 text-base">
          {user ? (
            <>
              <button
                onClick={() => goTo("/my-enrollments")}
                className="text-left hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                My Enrollments
              </button>
              <button
                onClick={() => goTo("/educator")}
                className="text-left hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                {user.publicMetadata?.role === "educator"
                  ? "Educator Dashboard"
                  : "Become Educator"}
              </button>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 mt-4"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  openSignIn();
                  closeDrawer();
                }}
                className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-50"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  openSignUp();
                  closeDrawer();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserDrawer;
