const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ token, user: { id: newUser._id, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req ,res)=>{
    const { email , password } = req.body ;
    try{
        const user = await User.findOne({email});
        if(!user || !(await bcrypt.compare(password , user.password))){
            return res.status(400).json({message:'Invalid Credentials'});
        }
        const token = jwt.sign({userId : user._id},process.env.JWT_SECRET ,{expiresIn:'1d'});
        res.json({token});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}
