const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

let _db;
const mongoConnectingFunc = () => {
  let url = process.env.MONGO_URL;
  MongoClient.connect(url)
    .then((client) => {
      console.log("Database connected!");
      _db = client.db();
    })
    .catch((err) => {
      console.log("error connecting database!!", err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  return null;
};

exports.mongoConnectingFunc = mongoConnectingFunc;
exports.getDb = getDb;
