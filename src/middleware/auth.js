const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = async (req,res,next) => {
  try{
    //here the function is looking for the header the user is suppose to provide
    const token = req.header('Authorization').replace('Bearer ','');
    console.log(token);
    //here the header is validated for the associated user
    const decoded = jwt.verify(token,'thisismynewcourse');
    //here the user finds the associated user
    const user = await User.findOne({_id:decoded._id, 'tokens.token' : token }); // this will look for a user with the id derived from the decoded token, with the token value from the tokens array, if the user logs off then the token will be valid
    console.log({decoded,user});
    if(!user){
      //if no user found, throw error
      throw new Error()
    }
    ///add token to the user found
    req.token = token;
    //send user
    req.user = user;
    next();
  }catch (e){
    ///if request cannot be authenticated, send error with message
    res.status(401).send({error: 'Please authenticate'});
  }
}

module.exports = auth;