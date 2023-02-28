const { Router } = require("express");
require("dotenv").config();
const userController = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../Models/User.model");
const { Authentication } = require("../Middlewares/Authentication");

// user sign up --------------------------------------------
// --------------------------------------------------------------
userController.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const existing_user = await userModel.findOne({ email });

  if (existing_user) {
    res.send({ msg: "user already exist" });
    return;
  }

  const new_user = new userModel({
    email,
    password,
    name
  });

  await new_user.save();
  res.send({ msg: "signup succesfull.." });
});

// ----------user-login------------------
// ---------------------------------------
userController.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (user) {
    

    const user_id = user._id;

    if (user.password == password && user.email == email) {
      const token = jwt.sign({ user_id }, process.env.SECRET);

      const email = user.email;

      const id = user._id;
      const document = {
        email: email,

        id: id,
        token: token,
      };
      res.send({ msg: "Login successfull", document: document });
    } else {
      res.send({ msg: "Login failed" });
    }
  } else {
    res.send({
      msg: "User not found ..please login with correct credentials..",
    });
  }
});

// --------------user dashboard----
// -----------------------------
userController.get("/dashboard", Authentication, async (req, res) => {
  // console.log(req.body,"mybody")
  const { user_id } = req.body;
  let user = await userModel.find({ _id: user_id });
//   console.log(user, "user");
  res.send({ user });
});




// --------------update user data----
// -----------------------------

userController.put('/update/:id',async(req, res) => {
    // console.log(req.params)
    console.log(req)
    // res.send({"msg":"helloe"})
    try {
      const { id } = req.params;
      const { updatedData } = req.body;
      const result = await userModel.findByIdAndUpdate(id, updatedData, { new: true });
 
    res.send({"msg":"success",result})
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = {
  userController,
};
