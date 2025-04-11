import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0">
      <h1 className="text-xl md:text-4xl text-white font-semibold">
        Learn anything, anytime, anywhere
      </h1>
      <p className="text-text-color sm:text-sm">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque quae
        excepturi rerum, nulla dolores, similique voluptates magnam ea nemo
        sequi.
      </p>
      <div className="flex items-center font-medium gap-6 mt-4">
        <button className="px-10 py-3 ronded-md text-white bg-button-bg hover:bg-hover-bg hover:scale-105">
          Get Started
        </button>
        <button className="flex items-center gap-2 text-link-color">
          Learn More <img src={assets.arrow_icon} alt="arrow_icon" />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
