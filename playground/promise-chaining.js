require("../src/db/mongoose.js");
const User = require("../src/models/user.js");

// User.findByIdAndUpdate("5f63741db6031f5af8ace0ed", {
//     age: 1
//   })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({
//       age: 1
//     }).then((count) => {
//       console.log(count);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, {
    age
  });
  const count = await User.countDocuments({
    age
  });
  return {
    user,
    count
  }
}

updateAgeAndCount("5f63741db6031f5af8ace0ed", 2).then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error);
})