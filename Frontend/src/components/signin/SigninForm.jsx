import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import InputField from "./InputField";
import RoleDropdown from "./RoleDropdown";
import { signin } from "../../api/auth";
import toast from "react-hot-toast";

function SigninForm({ role, open, setOpen, handleSelect }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedRole = role.toLowerCase();
      const data =
        normalizedRole === "admin"
          ? { role: "admin", password }
          : { role: normalizedRole, email: email.trim(), password };

      const res = await signin(data);
      localStorage.setItem("token", res.token);
      toast.success("Signin successful!");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:w-1/2 w-full flex flex-col md:justify-center 
      bg-black
      p-8 md:p-12 text-lg text-gray-100 shadow-xl">
      
      {/* Back to Home */}
      <div className="flex justify-end mb-6 hover:underline text-xl font-semibold">
        <a href="/" className="flex items-center gap-2 text-orange-400">
          <FaArrowLeft /> Back to Home
        </a>
      </div>

      {/* Sign In heading */}
      <div className="mb-8 flex items-center">
        <h3 className="text-2xl md:text-3xl font-bold text-orange-500 mr-4">
          Sign In
        </h3>
        <div className="flex-grow h-1 bg-orange-600"></div>
      </div>

      {/* Form */}
      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
        <RoleDropdown
          role={role}
          open={open}
          setOpen={setOpen}
          handleSelect={handleSelect}
        />

        {role.toLowerCase() !== "admin" && (
          <InputField
            icon={FaEnvelope}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {/* Password field with toggle */}
        <div className="relative">
          <InputField
            icon={FaLock}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
              text-gray-400 hover:text-orange-400 text-xl cursor-pointer transition-colors duration-200"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-orange-400 text-sm md:text-base font-medium hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-orange-700 
            text-white py-2.5 md:py-3 rounded-xl font-semibold shadow-md 
            hover:scale-105 transition-transform duration-300 
            text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Divider + Signup link */}
      <div className="my-4 md:my-6 flex items-center justify-center">
        <span className="h-px flex-1 bg-zinc-700"></span>
        <span className="px-2 md:px-3 text-gray-400 text-sm md:text-base">
          or
        </span>
        <span className="h-px flex-1 bg-zinc-700"></span>
      </div>
      <p className="text-center text-gray-300 text-sm md:text-base">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="text-orange-400 font-semibold hover:underline"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
}

export default SigninForm;
