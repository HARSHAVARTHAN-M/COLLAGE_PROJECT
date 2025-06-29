import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";


const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup, settingPopup } = useSelector((state) => state.popup);

  const { loading, error, message, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

 // Add this line to debug

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message, user]); // Added user

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } fixed md:sticky top-0 z-50 transition-all duration-700 md:left-0 flex w-64 bg-black text-white flex-col h-screen`}
      >
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" />
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <button
            onClick={() => setSelectedComponent("Dashboard")}
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            aria-label="Dashboard"
          >
            <img src={dashboardIcon} alt="dashboard" /> <span>Dashboard</span>
          </button>

          <button
            onClick={() => setSelectedComponent("Books")}
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
          >
            <img src={bookIcon} alt="books" /> <span>Books</span>
          </button>

            {isAuthenticated && user?.role === "Admin" && (  
            <>
              <button
                onClick={() => setSelectedComponent("Catalog")}
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              >
                <img src={catalogIcon} alt="catalog" /> <span>Catalog</span>
              </button>

              <button
                onClick={() => setSelectedComponent("Users")}
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              >
                <img src={usersIcon} alt="users" /> <span>Users</span>
              </button>

              <button
                onClick={() => dispatch(toggleAddNewAdminPopup())}
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              >
                <RiAdminFill className="w-6 h-6" /> <span>Add New Admin</span>
              </button>
            </>
           )} 
          {isAuthenticated && user?.role?.toLowerCase() === "user" && (
            <button
              onClick={() => {
                console.log('My Borrowed Books clicked');
                setSelectedComponent("My Borrowed Books");
              }}
              className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            >
              <img src={catalogIcon} alt="my-borrowed-books" />
              <span>My Borrowed Books</span>
            </button>
          )}

          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className="md:hidden w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
          >
            <img src={settingIcon} alt="setting" />{" "}
            <span>Update Credentials</span>
          </button>
        </nav>
        <div className="px-6 py-4">
          <button
            className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-5 mb-7 mx-auto w-fit"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="logout" /> <span>Log Out</span>
          </button>
        </div>
        <img
          src={closeIcon}
          alt="closeIcon"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden"
        />
      </aside>
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;
