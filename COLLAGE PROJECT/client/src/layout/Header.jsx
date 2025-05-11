import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { toggleSettingPopup } from "../store/slices/popUpSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <header className="fixed top-0 right-0 bg-white py-2 px-4 shadow-md flex justify-between items-center z-40 md:ml-64 w-full md:w-[calc(100%-16rem)]">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-2">
        <img src={userIcon} alt="usericon" className="w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-xs font-medium sm:text-base lg:text-lg sm:font-semibold">
            {user && user.name}
          </span>
          <span className="text-xs font-medium sm:text-base sm:font-medium">
            {user && user.role}
          </span>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex flex-col text-xs lg:text-sm items-end font-semibold">
          <span>{currentTime}</span>
          <span>{currentDate}</span>
        </div>
        <span className="bg-black h-10 w-[2px]" />
        <img
          src={settingIcon}
          alt="settingIcon"
          className="w-6 h-6"
          onClick={() => dispatch(toggleSettingPopup())}
        />
      </div>
    </header>
  );
};

export default Header;
