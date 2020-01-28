const express = require("express");
const app = express();
const dotenv = require("dotenv");

const apiRoute = require("./routes/api");

dotenv.config();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.use("/", apiRoute);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Server listening on port " + port);
});