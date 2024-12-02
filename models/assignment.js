const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  UserId: 
    {   type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
  Username:
    {
        type: String,
        required: true
    },
  AdminId: 
    {   type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
  Adminname:
    {
        type: String,
        required: true
    },
  task: 
    { 
        type: String, 
        required: true 
    },
  status: 
    { 
        type: String, 
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending' 
    },
  
},{timestamps:true});

module.exports = mongoose.model('Assignment', AssignmentSchema);
  