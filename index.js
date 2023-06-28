const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bounties = require("./router/bounties");
const applicaions = require("./router/applications");
const mongoConnectingFunc = require("./utils/database").mongoConnectingFunc;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Add Authorization header
  next();
});

app.use("/bounties", bounties);

app.use("/applications", applicaions);

mongoConnectingFunc();

app.listen(3002);
