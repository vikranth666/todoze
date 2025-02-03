import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const  apiUrl = import.meta.env.VITE_BACKEND_URL


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const { data } = await axios.post(`${apiUrl}/api/auth/register`, {
        email,
        password
      },
    {withCredentials:true});
  
      console.log("Registered:", data);
      navigate("/login"); // ✅ Redirect after successful registration
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      alert("Registration failed");
    }
  };

  return (

    <div className="  min-h-screen bg-gray-100 flex items-center justify-center p-4 bg-indigo-600  ">
      <div className="  max-w-lg  w-full bg-white rounded-xl shadow-lg p-12 ml-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Register</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 ml-100px">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required 
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
    
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
             type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
    
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Register
          </button>
        </form>
      </div>
    {/*   <div className="float-right">
      <div className="relative flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md z-[2] float-right">
        <div className="p-6">
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
            The place is close to Barceloneta Beach and bus stop just 2 min by walk
            and near to "Naviglio" where you can enjoy the main night life in
            Barcelona.
          </p>
       </div>
      </div>
      </div> */}
     
    </div>

    
  );
};

export default Register;
