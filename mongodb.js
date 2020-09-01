//CRUD create read update delete - ref https://www.npmjs.com/package/mongodb

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require("mongodb"); //shorthand of the above 3 declarations

// Connection URL
const connectionURL = "mongodb://127.0.0.1:27017"; ///as per the documentation we could have used localhost instead of IP address 127.0.0.1, but this has evidences of causing issues and also slowing down the application, so recommended to use the IP address

// Database Name
const databaseName = "task-manager";
// const id = new ObjectID();
// console.log(id.id);
// console.log(id.toHexString());
// console.log(id.toHexString().length);
// console.log(id.id.length);
// console.log(id.getTimestamp());

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to Database"); ///return is used so that the function stops after console logging this error message and doesn't go beyond this point, incase there is an error
    }
    console.log("Connected Correctly");

    const db = client.db(databaseName);
    db.collection("tasks")
      // .updateOne(
      //   {
      //     _id: new ObjectID("5f3fd8ee56a9f31fd1bb6fd1"),
      //   },
      //   {
      //     // $set: {
      //     //   name: "Shamim Merchant",
      //     // },
      //     $inc: {
      //       age: 1,
      //     },
      //   }
      // )
      // .then((result) => {
      //   console.log(result);
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
      .updateMany(
        {
          completed: { $eq: false },
        },
        {
          $set: {
            completed: true,
          },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);
