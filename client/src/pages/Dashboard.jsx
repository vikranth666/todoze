import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate ,Link } from "react-router-dom";
import { setTasks, addTask, updateTask, deleteTask } from "../redux/slices/taskSlices";
import { logout } from "../redux/slices/authSlices";
import { FiEdit, FiTrash, FiLogOut } from "react-icons/fi";
import { FaPowerOff } from "react-icons/fa6";
import Marquee from "react-fast-marquee";
import { debounce } from "lodash";


const  apiUrl = import.meta.env.VITE_BACKEND_URL

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.tasks);
  const token = useSelector((state) => state.auth.token);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [quote, setQuote] = useState("Loading inspirational quote...");
  const [quoteCount, setQuoteCount] = useState(0);

  const fetchQuote = async () => {
    try {
      const res = await axios.get("https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"));
      const json = JSON.parse(res.data.contents); // Convert the string back to JSON
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

  // Fetch quote when component mounts
  useEffect(() => {
    fetchQuote();
  }, []);

  // Throttle the scroll event using lodash.debounce
  const handleScroll = debounce(() => {
    fetchQuote(); // Fetch a new quote every scroll
  }, 100); // Adjust the debounce delay to control speed of quote generation (in ms)

  // Add scroll event listener when the component is mounted
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures the event listener is added only once

  

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(`${apiUrl}/api/tasks`,{
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
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error);
    }
  };

  const handleUpdateTask = async (id) => {
    if (!token || !editTitle.trim()) return;
    try {
      const { data } = await axios.put(`${apiUrl}/api/tasks${id}`, { title: editTitle }, {
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
      await axios.delete(`${apiUrl}/api/tasks${id}`, {
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
    <div className="min-h-screen  bg-indigo-500 bg-gray-100 p-6">
      <Link to="/login"><button className="absolute top-2  bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600">
      <FiLogOut className="mr-2" />Login</button></Link>
      <button onClick={handleLogout} className="absolute top-2 right-4 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600">
        <FaPowerOff className="mr-2" /> Logout
      </button>
      <Marquee speed={50}> {/* Adjusted speed here */}
        <h2 className=" text-xl font-semibold text-white text-center my-4">{quote}</h2>
      </Marquee>
      <h1 className="text-3xl font-bold text-center text-white mb-6">TASK MANAGEMENT</h1>
      <div className="flex justify-center mb-6">
        <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder= "Enter task title..." className="placeholder-white text-white w-1/2 p-2 border border-white rounded-lg shadow-sm focus:outline-none" />
        <button onClick={handleAddTask} className="ml-3 px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-stone-100 hover:text-indigo-800">Add Task</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded-lg shadow-md relative">
            {editTaskId === task._id ? (
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none" />
            ) : (
              <>
                <p className="text-lg font-semibold">{task.title}</p>
                <p className="text-sm text-gray-500">Created at: {new Date(task.createdAt).toLocaleString()}</p>
              </>
            )}
            <div className="flex justify-between mt-3">
              <button onClick={() => toggleEditMode(task._id, task.title)} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 flex items-center">
                <FiEdit className="mr-1" /> {editTaskId === task._id ? "Save" : "Edit"}
              </button>
              <button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 flex items-center">
                <FiTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;