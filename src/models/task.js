const mongoose = require("mongoose");

const Task = mongoose.model('Task',{
  description: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
      if (!value) {
        throw new Error("Description is required");
      }
    }
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    //This the reference to the User Model thus creating the relationship between the Task and the User models
    ref:'User'
  }
});
module.exports = Task;