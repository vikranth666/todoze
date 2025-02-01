const mongoose = require('mongoose');

const TaskSchema = new  mongoose.Schema({
    userId:mongoose.Schema.Types.ObjectId ,
    title : String ,
    description : String ,
    priority : {type : String ,enum :['High','Medium','Low'],default:'Medium'},
    dueDate : Date ,
    completed : {type:Boolean , default:false},
},{timestamps:true});

module.exports = mongoose.model('Task',TaskSchema)