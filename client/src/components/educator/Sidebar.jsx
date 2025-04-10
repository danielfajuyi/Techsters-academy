import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";


const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_tech },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_course_icon },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.course_list_icon,
    },
    {
      name: "Student Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.student_enrolled_icon,
    },
  ];

  return isEducator && (
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col" >
     {menuItems.map((item)=>(
      <NavLink 
      to={item.path}
      key={item.name}
      end={item.path === '/educator'}
        className={({isActive})=>`flex item-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-active-color border-r-[6px] border-indigo-500/90' : 'hover:bg-indigo-500 border-r-[6px] border-white hover:border-gray-100/90'}`}>
        <img src={item.icon} alt="" className="w-8 h-8" />
        <p className="md:block hidden text-center text-white">{item.name}</p>
      </NavLink>
     ))}
    </div>
  );
};

export default Sidebar;
