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
    required:true
  }
});
module.exports = Task;