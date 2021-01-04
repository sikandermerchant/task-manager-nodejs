require('../src/db/mongoose.js');
const Task = require('../src/models/task.js');

// Task.findByIdAndDelete('5f637035178cd85a9d054274').then((task) => {
//   console.log(task);
//   return Task.countDocuments({
//     completed: false
//   }).then((count) => {
//     console.log(count);
//   })
// }).catch((error) => {
//   console.log(error);
// })

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({
    completed: false
  });
  return {
    task,
    count
  }
}

deleteTaskAndCount('5f63718c178cd85a9d054276').then((result) => {
  console.log(result);
}).catch((e) => {
  console.log(e);
})