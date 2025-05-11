import React, { useState } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";
import Header from "../layout/Header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);
  const { settingPopup } = useSelector((state) => state.popup);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState((books && books.length) || 0);
  const [totalReturnBooks, setTotalReturnBooks] = useState(0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);

  useEffect(() => {
    if (users && Array.isArray(users)) {
      let numberOfUsers = users.filter((user) => user.role === "user");
      let numberOfAdmins = users.filter((user) => user.role === "Admin");

      setTotalUsers(numberOfUsers.length);
      setTotalAdmin(numberOfAdmins.length);
    }

    if (allBorrowedBooks && Array.isArray(allBorrowedBooks)) {
      //console.log("All Borrowed Books:", allBorrowedBooks);

      // Updated logic based on dueDate and returnDate
      let numberOfTotalBorrowedBooks = allBorrowedBooks.filter(
        (book) => book.dueDate && !book.returnDate
      );
      let numberOfTotalReturnedBooks = allBorrowedBooks.filter(
        (book) => book.returnDate
      );

     // console.log("Borrowed Count:", numberOfTotalBorrowedBooks.length);
     // console.log("Returned Count:", numberOfTotalReturnedBooks.length);

      setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
      setTotalReturnBooks(numberOfTotalReturnedBooks.length);
    }
  }, [users, allBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnBooks],
        backgroundColor: ["#3D3E3E", "#151619"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-10 bg-gray-50">
        <Header />
        <div className="flex flex-col-reverse xl:flex-row gap-8">
          {/* LEFT SIDE */}
          <div className="flex-[2] flex-col gap-8 lg:flex-row flex lg:items-center xl:flex-col justify-between xl:gap-20 py-5">
            <div className="xl:flex-[4] flex items-end w-full content-center transition-transform hover:scale-105">
              <Pie
                data={data}
                options={{ 
                  cutout: 0,
                  plugins: {
                    legend: {
                      labels: {
                        font: {
                          size: 14,
                          weight: 'bold'
                        }
                      }
                    }
                  }
                }}
                className="mx-auto lg:mx-0 w-full h-auto shadow-lg rounded-xl bg-white p-4"
              />
            </div>
            <div className="flex items-center p-8 w-full sm:w-[400px] xl:w-fit mr-5 xl:p-6 2xl:p-8 gap-6
              h-fit xl:min-h-[150px] bg-white xl:flex-1 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src={logo}
                alt="logo"
                className="w-auto xl:flex-1 rounded-lg transition-transform hover:scale-110"
              />
              <span className="w-[2px] bg-gray-300 h-full"></span>
              <div className="flex flex-col gap-4">
                <p className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <span className="w-4 h-4 rounded-full bg-[#3D3E3E]"></span>
                  <span className="font-medium">Total Borrowed Books : {totalBorrowedBooks}</span>
                </p>
                <p className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <span className="w-4 h-4 rounded-full bg-[#151619]"></span>
                  <span className="font-medium">Total Returned Books : {totalReturnBooks}</span>
                </p>
              </div>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="flex flex-[4] flex-col gap-8 lg:gap-16 lg:px-8 lg:py-5 justify-between xl:min-h-[85.5vh]">
            <div className="flex flex-col-reverse lg:flex-row gap-8 flex-[4]">
              <div className="flex flex-col gap-8 flex-1">
                {/* Stats Cards */}
                <div className="flex items-center gap-4 bg-white p-6 max-h-[130px] overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full lg:max-w-[380px]">
                  <span className="bg-gray-100 h-24 min-w-24 flex justify-center items-center rounded-xl">
                    <img src={usersIcon} alt="Usersicon" className="w-10 h-10 transition-transform hover:scale-110" />
                  </span>
                  <span className="w-[2px] bg-gray-200 h-24"></span>
                  <div className="flex flex-col items-center gap-3">
                    <h4 className="font-black text-4xl text-gray-800">{totalUsers}</h4>
                    <p className="font-medium text-gray-600 text-sm">
                      Total User Base
                    </p>
                  </div>
                </div>

                {/* Repeat similar styling for other stat cards */}
                <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
                  <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img
                      src={adminIcon}
                      alt="AdminsIcon"
                      className="w-8 h-8 "
                    />
                  </span>
                  <span className="w-[2px] bg-black h-20 lg:h-full "></span>
                  <div className="flex flex-col items-center gap-2">
                    <h4 className="font-black text-3xl">{totalAdmin}</h4>
                    <p className="font-light text-gray-700 text-sm">
                      Total Admin Base
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
                  <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img src={bookIcon} alt="BookIcon" className="w-8 h-8 " />
                  </span>
                  <span className="w-[2px] bg-black h-20 lg:h-full "></span>
                  <div className="flex flex-col items-center gap-2">
                    <h4 className="font-black text-3xl">{totalBooks}</h4>
                    <p className="font-light text-gray-700 text-sm">
                      Total Books Base
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
                  <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img src={bookIcon} alt="BookIcon" className="w-8 h-8 " />
                  </span>
                  <span className="w-[2px] bg-black h-20 lg:h-full "></span>
                  <div className="flex flex-col items-center gap-2">
                    <h4 className="font-black text-3xl">
                      {totalBorrowedBooks}
                    </h4>
                    <p className="font-light text-gray-700 text-sm">
                      Total Borrowed Books
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
                  <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img src={bookIcon} alt="BookIcon" className="w-8 h-8 " />
                  </span>
                  <span className="w-[2px] bg-black h-20 lg:h-full "></span>
                  <div className="flex flex-col items-center gap-2">
                    <h4 className="font-black text-3xl">{totalReturnBooks}</h4>
                    <p className="font-light text-gray-700 text-sm">
                      Total Returned Books
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row flex-1">
                <div className="flex flex-col lg:flex-row flex-1 items-center justify-center">
                  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center items-center gap-6 w-full">
                    <img
                      src={user && user.avatar?.url}
                      alt="avatar"
                      className="rounded-full w-36 h-36 object-cover border-4 border-gray-100 shadow-md transition-transform hover:scale-105"
                    />
                    <h2 className="text-2xl 2xl:text-3xl font-bold text-center text-gray-800">
                      {user && user.name}
                    </h2>
                    <p className="text-gray-600 text-base 2xl:text-lg text-center font-medium">
                      Welcome to the Admin Dashboard!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden xl:flex bg-white p-8 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-52 font-semibold relative flex-[3] justify-center items-center rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <h4 className="overflow-hidden text-gray-800 leading-relaxed">
                "Embarking on a journey of discovery, Personal Growth,
                Nurturing a path towards excellence, and Unlocking the potential
                within. refinedment of character."
              </h4>
              <p className="text-gray-600 text-base sm:text-lg absolute right-8 bottom-6 font-medium">
                ~ BIBLIOGEN TEAM
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;

{
  /* <div className="flex flex-col lg:flex-row flex-1">
<div className="flex flex-col lg:flex-row flex-1 items-center justify-center ">
  <div className="bg-white p-5 rounded-lg shadow-lg h-full flex flex-col justify-center items-center gap-4">
    <img
      src={user && user.avatar?.url}
      alt="avatar"
      className="rounded-full w-32 h-32 object-cover"
    />
    <h2 className="text-xl 2xl:text-2xl font-semibold text-center">
      {user && user.name}
    </h2>
    <p className="text-gray-600 text-sm 2xl:text-base text-center">
      Welcome to the Admin Dashboard!
    </p>
  </div>
</div>
</div> */
}
