const mongoose = require("mongoose");


mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
///when providing the db name, we provide the db url and the name in the same link which is different to how we connected to mongodb directly. task-manager-api is a new db that we will create