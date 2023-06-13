const { checkToken } = require("../utils/checkToken");

const getDb = require("../utils/database").getDb;

const getAllBounty = (req, res) => {
  if (req.query.type === "myposted") {
    res.status(200).send({
      test: "my posted bounties",
    });
  } else if (req.query.type === "assigned") {
    res.status(200).send({
      test: "assigned bounties",
    });
  } else {
    const db = getDb();
    if (db === null) {
      console.log("error: ", "Database Not Found");
      res.status(401).send({
        test: { err: "No DataBase not found" },
      });
    }
    const collection = db.collection("bounties");
    collection
      .find()
      .toArray()
      .then((data) => {
        // console.log(data);
        res.status(200).send({
          test: data,
        });
      })
      .catch((err) => {
        res.status(401).send({
          test: { err: "Not Bounties Found" },
        });
      });
  }
};

const getOneBounty = (req, res) => {
  const db = getDb();
  if (db === null) {
    console.log("error: ", "Database Not Found");
    res.status(401).send({
      test: "Error while querying",
    });
  }
  const collection = db.collection("bounties");
  collection
    .find({ _id: req.params.id })
    .next()
    .then((result) => {
      console.log(result);
      res.status(200).send({
        id: req.params.id,
        bountyData: result,
      });
    })
    .catch((err) => {
      console.log("error", err);
      res.status(401).send({
        test: "Error while querying",
      });
    });
};

const postBounty = async (req, res) => {
  const token = req.headers.authorization;
  if (token === "undefined") {
    return res.status(401).send({
      test: "You are not authorized to post a bounty",
    });
  }
  let githubData = await checkToken(token);
  if (!githubData) {
    return res.status(401).send({
      test: "You are not authorized to post a bounty",
    });
  }

  console.log(githubData, token);
  const body = req.body;
  const db = getDb();
  const collection = db.collection("bounties");
  collection
    .insertOne(body)
    .then((result) => {
      res.status(201).send({
        test: "bounty posted",
        dataPosted: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({
        test: "Your bounty didn't get posted",
      });
    });
};

module.exports = {
  getAllBounty,
  getOneBounty,
  postBounty,
};
