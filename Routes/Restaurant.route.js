const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { RestaurantModel } = require("../Models/Restaurant.Model");

const RestaurantRouter = express.Router();

RestaurantRouter.get("/", async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find();
    res.status(200).send({ message: "All Restaurants", restaurants });
  } catch (error) {
    res.status(401).send({ message: "Some Error", error: error.message });
  }
});

RestaurantRouter.get("/:id",async(req,res)=>{
  const ID=req.params.id;
  try {
    const getRestaurantById=await RestaurantModel.findById({ID});
    res.status(200).send({ message: "Restaurants Details", getRestaurantById });
  } catch (error) {
    res.status(401).send({ message: "Some Error", error: error.message });
  }
})
RestaurantRouter.get("/:id/menu",async(req,res)=>{
  const ID=req.params.id;
  try {
    const getRestaurantById=await RestaurantModel.findById({ID});
    res.status(200).send({ message: "Restaurants Details", getRestaurantById });
  } catch (error) {
    res.status(401).send({ message: "Some Error", error: error.message });
  }
})

module.exports = { RestaurantRouter };


