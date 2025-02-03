const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ token, user: { id: newUser._id, email: newUser.email } });

  } catch (error) {
    console.error("Registration Error:", error); // ✅ Logs error in server logs
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user._id, email: user.email }
    });

  } catch (err) {
    console.error("Login Error:", err); // ✅ Logs error
    res.status(500).json({ error: err.message });
  }
};

