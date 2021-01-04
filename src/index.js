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