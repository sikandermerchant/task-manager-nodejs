const express = require('express');
const router = new express.Router();
const User = require('../models/user.js');
const auth = require('../middleware/auth')

//router to create new user - sign-up
router.post("/users", async (req, res) => {
  //create an instance of a new user
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user , token});
  } catch (e) {
    res.status(400).send(e);
  }
});

//router for user login
router.post('/users/login', async (req,res) => {
  try{
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByCredentials(email,password);
    const token = await user.generateAuthToken(); //the new method to generate tokens is applied on the individual 'user' and not the collection of users 'User'
    res.send({user, token});
  }
  catch(e){
    res.status(400).send();
  }
});

//router to logout single session for a user
router.post('/users/logout', auth, async(req,res)=>{
  //we will target the specific token so we can manage sessions with multiple devices when using auth function from the middleware
  //here we will logout from one session removing a specific token
  try{
    ///removing a given item from the tokens array using the array filter method.
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    //save the user after removing the filtered token
    await req.user.save();
    res.send()
  }catch(e){
    res.status(500).send()
  }
})

//router to logout all sessions for a user
router.post('/users/logoutAll',auth,async (req,res) => {
  try{
    //empty the tokens array
    req.user.tokens = [];
    //save the user
    await req.user.save();
    res.send();
  }
  catch(e){
    res.status(500).send()
  }
})

//router to edit user details - your own using auth
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid update, property not found'
    })
  }
  //req.user is used as we have attached the user on req object and we have access to it as we are using authentication middleware auth, if weren't using that then we would have used req.params as we have did earlier when not using the auth middleware. Also, we don't need to run the if statement to identify if the user exist as we are authenticating the user thus proving that it exists
  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})

//router to get user profile that currently logged in with - here we pass the middleware function 'auth' as the second parameter to the route
router.get("/users/me",auth ,async (req, res) => {
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (e) {
  //   res.status(500).send(error);
  // }
  //when changing the route to only authenticate the user we dont need the above code...note that the new route has changed to /users/me from just /users. In this case we will ony send back the user that was created in the auth.js file as follows:
  res.send(req.user)
});

//router to delete a logged in user - yourself using auth
router.delete('/users/me', auth, async (req, res) => {
  //req.user._id is used as we have attached the user on req object and we have access to it as we are using authentication middleware, if weren't using that then we would have used req.params.id as we have did earlier when not using the auth middleware.
  const _id = req.user._id;
  try {
    //since we are authenticating the user using auth middleware we don't need to check the user for the particular id
    // const user = await User.findByIdAndDelete(_id);
    // if (!user) {
    //   return res.status(404).send()
    // }
    //replace the above check with the below mongoose method of remove as part of further refactoring
    console.log(req.user);
    await req.user.remove();
    res.send(req.user)
  } catch (e) {
    res.status(500).send();
  }
})


module.exports = router