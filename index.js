const express = require("express");
require("dotenv").config();
const { connection } = require("./Config/db");
const { UserRouter } = require("./Routes/User.Router");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(201).send({ message: "Api is working Fine." });
});

app.use("/api", UserRouter);
app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`Connected to DB`);
  } catch (error) {
    console.log(`Not Connected to DB`);
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});
