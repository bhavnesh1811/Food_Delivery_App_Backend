const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Models/User.Model");
const bcrypt = require("bcrypt");

const UserRouter = express.Router();

UserRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(201).send({ message: "All Users", users });
  } catch (error) {
    res.status(401).send({ message: "Some Error", error: error.message });
  }
});

UserRouter.post("/register", async (req, res) => {
  const { name, email, password, address } = req.body;
  const { street, city, state, country, zip } = address;

  //   console.log(name, email, password,address,street, city, state, country, zip);
  const saltRounds = 5;

  const users = await UserModel.find({ email });
  if (users.length === 0) {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        res.status(400).send({ message: err.message });
      } else {
        try {
          const newUser = new UserModel({
            name,
            email,
            password: hash,
            address: {
              street,
              city,
              state,
              country,
              zip,
            },
          });
          await newUser.save();
          res.status(200).send({ message: "User Registration Suceessful" });
        } catch (e) {
          res.status(401).send({ message: "Something Went Wrong" });
        }
      }
    });
  } else {
    res.status(201).send({ message: "User already exist, Please login" });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.find({ email });

  if (user.length > 0) {
    bcrypt.compare(password, user[0].password, async (err, result) => {
      if (result) {
        try {
          const token = jwt.sign(
            { userID: user[0]._id },
            process.env.userSecretKey
          );
          res.status(200).send({ message: "Login Successful", token: token });
        } catch (e) {
          res
            .status(401)
            .send({ message: "Something Went Wrong", err: e.message });
        }
      } else {
        res
          .status(201)
          .send({ message: "Wrong Credentials", error: "Wrong Password" });
      }
    });
  } else {
    res
      .status(201)
      .send({ message: "User is not registered,Please register first" });
  }
});

UserRouter.patch("/user/:id/reset", async (req, res) => {
  const id = req.params.id;
  const { password, newPassword, confirmNewPassword } = req.body;
  const user = await UserModel.findById(id);
console.log(id,password, newPassword, confirmNewPassword,user);
  if (user.length > 0) {
    bcrypt.compare(password, user[0].password, async (err, result) => {
      if (result) {
        try {
          const saltRounds = 5;
          const existingUser = await UserModel.findOne({ id });

          if (newPassword === confirmNewPassword) {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
              if (err) {
                res.status(400).send({ message: err.message });
              } else {
                existingUser.password = hash;
                await existingUser.save();
                res
                  .status(200)
                  .send({ message: "Password Changed Successfully" });
              }
            });
          } else {
            res
              .status(200)
              .send({ message: "New Password and Confirm Password Mismatch" });
          }
        } catch (e) {
          res
            .status(401)
            .send({ message: "Something Went Wrong", err: e.message });
        }
      } else {
        res
          .status(201)
          .send({ message: "Old Password Error", error: "Wrong Password" });
      }
    });
  } else {
    res.status(201).send({ message: "User not exist,Please register first" });
  }
});

module.exports = { UserRouter };

// {
//     "name":"Bhavnesh Arora",
//     "email":"ba@gmail.com",
//     "password":"2222",
//     "address":{
//       "street":"kaziwada",
//       "city":"Palwal",
//       "state":"Haryana",
//       "country":"India",
//       "zip":"121102"
//     }

//   }
