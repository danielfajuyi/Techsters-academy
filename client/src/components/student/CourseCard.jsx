import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);
  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
    >
      <img className="w-full" src={course.courseThumbnail} alt="" />
      <div className="p-3 text-left">
        <h3 className="text-white font-semibold">{course.courseTitle}</h3>
        <p className="text-text-color">{course.educator.name}</p>
        <div className="flex items-center space-x-2 text-text-color">
          <p>{calculateRating(course)}</p>
          <div className="flex" >
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
                className="w-3.5 h-3.5  "
              />
            ))}
          </div>
          <p className="text-text-color">{course.courseRating.length}</p>
        </div>
        <p className="text-base font-semibold text-text-color">
          {currency}
          {(
            course.coursePrice -
            (course.discount * course.coursePrice) / 100
          ).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
