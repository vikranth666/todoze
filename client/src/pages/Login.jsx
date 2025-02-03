import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlices";
import { useNavigate ,Link } from "react-router-dom";
import axios from "axios";


const  apiUrl = import.meta.env.VITE_BACKEND_URL

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${apiUrl}/api/auth/login`,
     { email, password },
     { withCredentials: true }  //  Important for CORS
      );
      
      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (

<div className="  min-h-screen bg-indigo-500 bg-gray-100 flex items-center justify-center p-4    ">
  <div className="  max-w-lg  w-full bg-white rounded-xl shadow-lg p-12 ">
    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">LogIn</h2>
    
    <form onSubmit={handleSubmit} className="space-y-4 ml-100px">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
           type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
         type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
      </div>

      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
        Sign In
      </button>
    </form>

    <div className="mt-6 text-center text-sm text-gray-600">
      Don't have an account? 
      <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">Register</Link>
    </div>
  </div>
</div>

  );
};

export default Login;
