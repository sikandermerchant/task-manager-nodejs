// This file contains router which were used as practice but have all been refactored with authentication middleware to make it ready for real life application in user.js
// 


//router to get all users - not to be used in real applications
router.get('/users',async(req,res) =>{
  try{
    const users = await User.find({});
    res.send(users)
  }catch(e){
    res.status(500).send('No users found!')
  }
})

//router to get user by id - this wont be needed in real application as we wont have any user requesting another user details
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
  console.log(req.params);
});


//router to get user by id - this wont be needed in real application as we wont have any user requesting another user details
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
  console.log(req.params);
});

//router to edit user details by id - this will not be used in real application as you wont allow users to edit each others account
router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body); //The Object.keys() method returns an array of a given object's own enumerable property names, iterated in the same order that a normal loop would. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid update, property not found'
    })
  }
  const _id = req.params.id;
  try {

    const user = await User.findById(_id);
    updates.forEach((update) => user[update] = req.body[update]);
    await user.save();

    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    if (!user) {
      return res.status(404).send();
    }
    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

//router to delete any user, without auth - this wont be used in real like application as you wont allow users to delete other users accidentally or maliciously. 
router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (e) {
    res.status(500).send();
  }
})