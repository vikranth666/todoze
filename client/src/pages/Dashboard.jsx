import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { setTasks, addTask, updateTask, deleteTask } from "../redux/slices/taskSlices";
import { logout } from "../redux/slices/authSlices";
import { FiEdit, FiTrash, FiLogOut, FiPlus, FiCheck } from "react-icons/fi";
import { FaPowerOff } from "react-icons/fa6";
import Marquee from "react-fast-marquee";
import { debounce } from "lodash";
import "../styles.css"; // Import the CSS file

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.tasks);
  const token = useSelector((state) => state.auth.token);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [quote, setQuote] = useState("Loading inspirational quote...");
  const [showInput, setShowInput] = useState(false);

  const fetchQuote = async () => {
    try {
      const res = await axios.get("https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"));
      const json = JSON.parse(res.data.contents);
      if (Array.isArray(json) && json.length > 0) {
        setQuote(`${json[0].q} - ${json[0].a}`);
      } else {
        setQuote("No quote found.");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote("Failed to load quote.");
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleScroll = debounce(() => {
    fetchQuote();
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(`${apiUrl}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        dispatch(setTasks(data));
      } catch (error) {
        console.error("Error fetching tasks:", error.response?.data || error);
      }
    };
    fetchTasks();
  }, [dispatch, token]);

  const handleAddTask = async () => {
    if (!token || !newTaskTitle.trim()) return;
    try {
      const newTask = { title: newTaskTitle, createdAt: new Date().toISOString() };
      const { data } = await axios.post(`${apiUrl}/api/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch(addTask(data));
      setNewTaskTitle("");
      setShowInput(false);
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error);
    }
  };

  const handleUpdateTask = async (id) => {
    if (!token || !editTitle.trim()) return;
    try {
      const { data } = await axios.put(`${apiUrl}/api/tasks/${id}`, { title: editTitle }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch(updateTask(data));
      setEditTaskId(null);
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`${apiUrl}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch(deleteTask(id));
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleEditMode = (id, title) => {
    if (editTaskId === id) {
      handleUpdateTask(id);
    } else {
      setEditTaskId(id);
      setEditTitle(title);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-500 p-6 font-sans">
      {/* Floating glass header */}
      <div className="fixed top-0 left-0 right-0 bg-white bg-opacity-10 backdrop-blur-lg shadow-lg z-10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/login">
            <button className="bg-teal-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-teal-600 shadow-md transition-all duration-300">
              <FiLogOut className="mr-2" />Login
            </button>
          </Link>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 hidden md:block">FOCUS FLOW</h1>
          <button 
            onClick={handleLogout} 
            className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-600 shadow-md transition-all duration-300"
          >
            <FaPowerOff className="mr-2" /> Logout
          </button>
        </div>
      </div>

      <div className="pt-24 max-w-6xl mx-auto">
        {/* Quote banner with gradient background */}
        <div className="mb-8 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden animate-fade-in-down">
          <Marquee 
            speed={40} 
            gradientColor={[56, 189, 248]} 
            gradientWidth={50}
          >
            <h2 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 py-4 px-8">{quote}</h2>
          </Marquee>
        </div>

        {/* Main title */}
        <h1 className="text-4xl md:text-5xl font-black text-white text-center mb-10 tracking-tight animate-fade-in">
          TASK MANAGEMENT
        </h1>

        {/* Add task button or input field */}
        <div className="flex justify-center mb-10 animate-fade-in">
          {showInput ? (
            <div className="flex w-full max-w-md">
              <input 
                type="text" 
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)} 
                placeholder="What needs to be done?" 
                className="w-full p-4 text-lg border-none rounded-l-2xl shadow-inner focus:outline-none text-blue-900 placeholder-blue-300 bg-white bg-opacity-90"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                autoFocus
              />
              <button 
                onClick={handleAddTask} 
                className="px-6 py-4 bg-teal-500 text-white font-bold rounded-r-2xl hover:bg-teal-600 transition-colors shadow-md"
              >
                <FiCheck className="text-xl" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowInput(true)} 
              className="px-6 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FiPlus className="text-xl" /> Add New Task
            </button>
          )}
        </div>

        {/* Tasks grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <div 
              key={task._id} 
              className=" bg-opacity-10 backdrop-blur-md p-6 rounded-2xl shadow-xl relative border border-white border-opacity-20 group hover:bg-opacity-20 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {editTaskId === task._id ? (
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  className="w-full p-3 bg-white bg-opacity-90 border-none rounded-xl shadow-inner focus:outline-none text-blue-900"
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateTask(task._id)}
                  autoFocus
                />
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-2 break-words">{task.title}</h3>
                  <p className="text-sm text-blue-100 opacity-80 font-medium">
                    {new Date(task.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </>
              )}
              <div className="flex justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => toggleEditMode(task._id, task.title)} 
                  className="bg-teal-500 text-white px-3 py-2 rounded-xl hover:bg-teal-600 flex items-center shadow-md transition-colors hover:scale-105 active:scale-95"
                >
                  <FiEdit className="mr-1" /> {editTaskId === task._id ? "Save" : "Edit"}
                </button>
                <button 
                  onClick={() => handleDeleteTask(task._id)} 
                  className="bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-blue-600 flex items-center shadow-md transition-colors hover:scale-105 active:scale-95"
                >
                  <FiTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center mt-10 text-white animate-fade-in">
            <p className="text-2xl font-medium">No tasks yet</p>
            <p className="text-blue-100 mt-2">Add your first task to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;