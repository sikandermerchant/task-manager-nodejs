//Setup express server
const express = require("express");

//Load (require) mongoose.js
require("./db/mongoose");

//Require Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

// app.use((req,res,next) =>{
//   if(req.method === 'GET'){
//     res.send('GET request are disabled!')
//   }else{
//     next()
//   }
// })

// app.use((req,res,next) =>{
//   // if(req.method){
//   //   res.status(503).send('Site under maintenance');
//   // }else{
//   //   next()
//   // } or a another way as below:
//   res.status(503).send('Site under maintenance, please try later')
// })


///Use
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//Start the server
app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});

//playground for hiding private data
// const pet = {name: 'kira'};
// pet.toJSON = function(){
//   console.log(this);
//   return this;
// }
// console.log(JSON.stringify(pet));
//this o/ps our json string as {"name":"kira", toJSON:Function(anonymous)]} and json string of pet object {"name" = "kira"}

//What we can also do is now manipulate the object that returns to not have any data or hide the data we want as:
// const pet = {name: 'kira'};
// pet.toJSON = function(){
//   console.log(this);
//   return {};
// }
// console.log(JSON.stringify(pet));
// ///the above will console log the object through 'this' i.e. as {"name":"kira", toJSON:Function(anonymous)]} however the return object as an empty json with no properties {} not sending back any data - i.e. hide it  
//express does the same - when we pass an object to res.send(), it calls JSON.stringify() behind the scenes an converts our object to a json string. We have setup a toJSON method on the user where we manipulate the user object to only send that we ask for hiding the data like password and token which we want to hide.

//playground for jwt tokens
// const jwt = require('jsonwebtoken')
// const myFunction = async() =>{
//   const token = jwt.sign({_id: 'hello123'},'thisismynewcourse',{expiresIn: '60 seconds'});
//   console.log(token);

//   const data = jwt.verify(token,'thisismynewcourse');
//   console.log(data);
// }
// myFunction();
//playground for associating task router to user
const Task = require('./models/task');
const User = require('./models/user');
const main = async()=>{
  // const task = await Task.findById('5ff485d7b53d3c04864febbe');
  // // const user = await User.findById('5ff47f1eb53d3c04864febbc');
  // //the relationship between the models(User and Task above)scan be simplified by using Mongoose by providing one additional property in the task model owner field called ref. 
  //We then add the populate method on the task to populate the associated owner field of that Task which in turn is related to the logged in User
  // await task.populate('owner').execPopulate();
  // console.log(task.owner);
  // // console.log(user.name);

  //Now lets go ahead and start with a user and find their associated task as opposed to what we did earlier. Here similar to what we did to the task by adding a ref field, we will add a virtual property for the user model, a virtual property is not a data stored in the db but a relationship between two entities - in this case between our user and task
  const user = await User.findById('5ff47f1eb53d3c04864febbc');
  await user.populate('tasks').execPopulate()
  console.log(user.tasks);//this will console print an array with all associated tasks for the particular user
}
main();