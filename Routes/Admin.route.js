const { Router } = require("express");
const adminController = Router();
require("dotenv").config()
const jwt = require("jsonwebtoken");
const { Authentication } = require("../Middlewares/Authentication");
const { adminModel } = require("../Models/Admin.model");
const { userModel } = require("../Models/User.model");




// -------------------admin signup api--------------------------------
// -------------------------------------------------------------------
adminController.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const existing_user = await adminModel.findOne({ email });


  // ---validation existing user -------
  if (existing_user) {
    res.send("Admin already exist");
    return;
  }

  //   -------------

  const new_admin = new adminModel({
    email,
    password,
    name,
  });

  await new_admin.save();
  res.send({ msg: "Admin added succesfully.." });
});

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

// -------------------admin login api--------------------------------
// -------------------------------------------------------------------

adminController.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  const admin = await adminModel.findOne({ email });
  console.log(admin,"admin")
  if (admin) {
    if (admin.email == email && admin.password == password) {
      const admin_id = admin._id;

  

      const token = jwt.sign({ admin_id }, process.env.SECRET);
      res.send({ message: "Login successfull", token });
    } else {
      res.send({ message: "Login failed" });
    }
  } else {
    res.send({
      message:
        "only admin can access ..please login with correct credentials..",
    });
  }
});

// ---------------------admin data----------

adminController.get("/data",Authentication,async(req,res)=>{
    const { user_id } = req.body;
  let allusers = await userModel.find();
  let alladmins = await adminModel.find();
//   console.log(user, "user");
  res.send({ allusers ,alladmins});

})


module.exports = {
  adminController,
};
