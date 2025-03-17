import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlices";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true } // Important for CORS
      );
      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 md:p-12"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-extrabold text-gray-800 mb-6 text-center tracking-tight"
        >
          Welcome Back
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-gray-800"
            />
          </motion.div>
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
              Forgot password?
            </a>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-lg"
          >
            Sign In
          </motion.button>
        </form>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center text-gray-600"
        >
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-600 hover:text-teal-700 font-medium ml-1 transition-colors">
            Create one now
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;