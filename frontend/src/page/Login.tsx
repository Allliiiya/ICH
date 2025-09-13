import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import loginBg from "../assets/images/Chinese-Dragon.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaWeixin, FaUserCircle } from "react-icons/fa";

export default function Login() {
  type LoginFormFields = { email: string; password: string, rememberMe: boolean};
  const { register, handleSubmit } = useForm<LoginFormFields>();
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("signupEmailPrefill") || "";
    if (email) {
      setPrefilledEmail(email);
      localStorage.removeItem("signupEmailPrefill");
    }
  }, []);

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoginMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setLoginMessage(result.message);
      if (res.ok && result.token) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("heritage_jwt", result.token);
        window.dispatchEvent(new Event("user-logged-in"));
        try {
          const decoded: any = jwtDecode(result.token);
          if (decoded.is_admin) {
            navigate("/admin");
            return;
          }
        } catch {}
        navigate("/");
      }
    } catch (err) {
      setLoginMessage("Network error");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginMessage("");
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("storage"));
    // Optionally clear any user state here
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
        {isLoggedIn ? (
          <div className="relative group">
            <button className="flex items-center gap-2 text-gray-700 hover:text-green-700 focus:outline-none">
              <FaUserCircle size={28} />
            </button>
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-10">
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
            </div>
          </div>
        ) : (
          <button
            className="text-gray-700 hover:text-green-700 font-medium"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </nav>
      <div className="flex justify-center items-center flex-1">
        {/* Login Dialog or User Info */}
        {!isLoggedIn ? (
          <div className="flex flex-col max-w-md min-h-[25rem] w-full p-6 bg-white rounded-xl shadow">
            <div className="pb-10">
              <h1 className="text-3xl font-bold">Sign in</h1>
              <span className="text-sm text-gray-600">
                Dive into the culture of China
              </span>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-4 w-full"
            >
              <input
                {...register("email", { required: true })}
                placeholder="Email Address"
                className="p-2 border rounded"
                value={prefilledEmail || undefined}
                onChange={e => {
                  setPrefilledEmail("");
                  // react-hook-form will handle the value
                }}
              />
                <input
                  {...register("password", { required: true, minLength: 8 })}
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                />

              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    {...register("rememberMe")}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor="rememberMe" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <a className="hover:underline text-sm text-gray-500 cursor-pointer">
                  Forgot Password?
                </a>
              </div>
              <div className="flex flex-col space-y-4">
                <button className="bg-gray-900 text-white font-bold py-2 px-4 rounded hover:bg-gray-800 transition">
                  Sign in
                </button>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span>or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button className="flex gap-2 cursor-pointer items-center justify-center bg-gray-900 text-white font-bold py-2 px-4 rounded hover:bg-gray-800 transition">
                <FcGoogle
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                />
                <span>Continue with Google</span>
                </button>
              </div>
              {loginMessage && (
                <div className="text-center text-red-600 mt-2">{loginMessage}</div>
              )}
              <div className="flex justify-center text-sm text-gray-600 pt-4">
                Don't have an account?
                <Link
                  to="/signup"
                  className="ml-1 text-blue-600 hover:underline font-medium"
                >
                  Join now
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <FaUserCircle size={80} className="text-green-700 mb-4" />
            <div className="text-xl font-semibold mb-2">Welcome!</div>
            <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
