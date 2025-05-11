import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Sidebar from "../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import Header from "../layout/Header";

const Home = () => {
  const [isSideBaropen, setIsSideBaropen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSideBarOpen={isSideBaropen}
        setIsSideBarOpen={setIsSideBaropen}
        setSelectedComponent={setSelectedComponent}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="md:hidden fixed top-4 right-6 z-50">
          <button className="bg-black rounded-md h-9 w-9 flex items-center justify-center text-white">
            <GiHamburgerMenu
              className="text-2xl"
              onClick={() => setIsSideBaropen(!isSideBaropen)}
            />
          </button>
        </div>
        <main className="flex-1 overflow-auto pt-16 px-4">
          {(() => {
            switch (selectedComponent) {
              case "Dashboard":
                return user?.role?.toLowerCase() === "user" ? (
                  <UserDashboard />
                ) : (
                  <AdminDashboard />
                );
              case "Books":
                return <BookManagement />;
              case "Catalog":
                if (user?.role === "Admin") {
                  return <Catalog />;
                }
                return <Navigate to="/" />;
              case "Users":
                if (user?.role === "Admin") {
                  return <Users />;
                }
                return <Navigate to="/" />;
              case "My Borrowed Books":
                if (user?.role?.toLowerCase() === "user") {
                  return <MyBorrowedBooks />;
                }
                return <Navigate to="/" />;
              default:
                // return user?.role === "user" ? (
                return user?.role?.toLowerCase() === "user" ? (
                  <UserDashboard />
                ) : (
                  <AdminDashboard />
                );
            }
          })()}
        </main>
      </div>
    </div>
  );
};

export default Home;
