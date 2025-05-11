import React from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification } from "../store/slices/authSlice";
import { resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useEffect } from "react"; // Import useEffec
import { useNavigate } from "react-router-dom"; // Import useNavigate from

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, message, error, loading]); // Added message to dependencies

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          <Link
            to={"/register"}
            className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 absolute top-10 left-10 hover:bg-black hover:text-white transition duration-300 text-center"
          >
            Back
          </Link>
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-12">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">
              Check your Mailbox
            </h1>
            <p className="text-gray-800 text-center mb-12">
              Please enter the OTP sent to {email}
            </p>
            <form onSubmit={handleOtpVerification} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="number"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none text-center text-xl tracking-wider"
                />
                <button
                  type="submit"
                  className="w-full border-2 border-black font-semibold bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black transition duration-300"
                >
                  Verify OTP
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-12">
              <img src={logo_with_title} alt="logo" className="h-44 w-auto" />
            </div>
            <p className="text-gray-300 mb-8 text-lg">
              Enter the OTP sent to your email to complete registration
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;
