const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!value) {
        throw new Error("Name is required")
      }
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email Address");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Please choose a different password");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required:true
      }
    }
  ]
});
//Use method on individual documents if you want to manipulate the individual document like adding tokens etc. Use the statics approach if you want query the whole collection. Static methods are available on models (e.g User) whereas methods are available on instances (e.g. user)

///for below, please refer to playground for hiding private data
userSchema.methods.toJSON = function(){
  const user = this;
  //get back a raw object with our user data attached which will remove all data that mongoose has added on there to perform operations like save
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
  
}

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({_id:user._id.toString()},'thisismynewcourse');//since _id is an Object id hence we use toString() to convert it into a standard string as expected by jwt
  user.tokens = user.tokens.concat({token}) //here we add the newly generated token to the tokens array
  await user.save();
  return token;
}//we use standard function instead of arrow function as we would need 'this' binding


userSchema.statics.findByCredentials = async (email,password) => {
  //find user by email
  const user = await User.findOne({email});
  if(!user){
    throw new Error('Unable to login');
  }
  const isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch){
    throw new Error('Unable to login');
  }

  return user;
}

//Hash the plain text password
userSchema.pre('save', async function(next){
  const user = this;
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8);
  }

  next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;