import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

interface SignupData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
}

const Signup: React.FC = () => {
  const [signupData, setSignupData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = (): boolean => {
    if (signupData.password !== signupData.rePassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return false;
    }
    setError(""); 
    return true;
  };

  const processSignup = async () => {
    if (!validateInputs()) return;

    toast.loading("Please wait...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/signup`,
        signupData
      );
      toast.dismiss();
      toast.success(response.data.message);

      setSignupData({
        name: "",
        email: "",
        password: "",
        rePassword: "",
      });
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Try again.";
      setError(errorMessage);
      toast.dismiss();
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>
        <form
          className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            processSignup();
          }}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={signupData.name}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={signupData.email}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={signupData.password}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="rePassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="rePassword"
                name="rePassword"
                type="password"
                required
                value={signupData.rePassword}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-white">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-200 hover:text-indigo-100"
          >
            Sign in
          </Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default Signup;
