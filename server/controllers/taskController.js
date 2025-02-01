const Task = require('../models/Task');

exports.getTasks = async (req , res)=>{
    const tasks = await Task.find({userId:req.user.id});
    res.json(tasks);
};

exports.createTask = async (req , res)=>{
    const task = await Task.create({...req.body ,userId : req.user.id});
    res.status(201).json(task);
};

exports.updateTask = async (req , res)=>{
    const task = await Task.findByIdAndUpdate(req.params.id , req.body , {new:true});
    res.json(task);
};

exports.deleteTask = async (req , res)=>{
    const task = await Task.findByIdAndDelete(req.params.id)
    res.json({message:'task deleted successfully'})
}

