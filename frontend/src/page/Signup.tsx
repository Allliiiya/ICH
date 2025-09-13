import { useForm } from "react-hook-form";
import { useState } from "react";

import loginBg from "../assets/images/Chinese-Dragon.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  type SignupFormFields = { email: string; password: string };
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<SignupFormFields>();
  const navigate = useNavigate();
  const [signupMessage, setSignupMessage] = useState("");

  const onSubmit = async (data: { email: string; password: string }) => {
    setSignupMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password, name: "User" }),
      });
      const result = await res.json();
      setSignupMessage(result.message);
      if (res.ok) {
        navigate("/login");
      }
    } catch (err) {
      setSignupMessage("Network error");
    }
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <nav className="bg-transparent w-full flex items-center justify-between px-12 py-6">
        <button
          className="text-green-800 font-serif text-3xl font-normal select-none cursor-pointer"
          onClick={() => navigate("/")}
        >
          Heritage
        </button>
          <button
            className="text-gray-700 hover:text-green-700 font-medium"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
      </nav>
      <div className="flex justify-center items-center flex-1">

          <div className="flex flex-col max-w-md min-h-[25rem] w-full p-6 bg-white rounded-xl shadow">
            <div className="pb-10">
              <h1 className="text-3xl font-bold">Sign up</h1>
              <span className="text-sm text-gray-600">
                Dive into the culture of China
              </span>
            </div>
            <form
              className="flex flex-col space-y-4 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                {...register("email", { required: true })}
                placeholder="Email Address"
                className="p-2 border rounded"
                onChange={() => {
                  // react-hook-form will handle the value
                }}
              />
              <div className="w-full relative">
                <input
                  {...register("password", { required: true, minLength: 8 })}
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                />
              <button 
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute cursor-pointer font-semibold right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              </div>
              <div className="flex flex-col space-y-4">
                {signupMessage && (
                  <div className="text-center text-red-600 mt-2">{signupMessage}</div>
                )}
              <span className="text-xs">
                By signing up, you agree to our{' '}
                <span className="text-blue-600 hover:underline font-medium">Terms</span>,{' '}
                <span className="text-blue-600 hover:underline font-medium">Privacy Policy</span>{' '}
                and{' '}
                <span className="text-blue-600 hover:underline font-medium">Cookies Policy</span>.
              </span>
              <button className="bg-gray-900 text-white font-bold py-2 px-4 rounded hover:bg-gray-800 transition">
                Sign up
              </button>
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <div className="flex-grow border-t border-gray-300"></div>
                <span>or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            </div> 
              <button className="flex gap-2 cursor-pointer items-center justify-center bg-gray-900 text-white font-bold py-2 px-4 rounded hover:bg-gray-800 transition">
              <FcGoogle
                className="w-6 h-6 rounded-full flex items-center justify-center"
              />
              <span>Continue with Google</span>
              </button>
              <div className="flex justify-center text-sm text-gray-600 pt-4">
                Already have an account?
                <Link
                  to="/login"
                  className="ml-1 text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
}
