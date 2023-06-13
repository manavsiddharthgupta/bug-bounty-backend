const { ObjectId } = require("mongodb");
const { checkToken } = require("../utils/checkToken");

const getDb = require("../utils/database").getDb;

const getAllApplication = (req, res) => {
  if (req.query.bountyId) {
    const db = getDb();
    if (db === null) {
      console.log("error: ", "Database Not Found");
      res.status(401).send({
        test: "Error while querying",
      });
    }
    const collection = db.collection("applications");
    collection
      .find({ bountyId: req.query.bountyId })
      .toArray()
      .then((result) => {
        res.status(200).send({
          test: result,
        });
      })
      .catch(() => {
        res.status(400).send({
          test: "Error while querying",
        });
      });
  } else {
    res.status(400).send({
      test: "invalid bountyID",
    });
  }
};

const postAnApplication = async (req, res) => {
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

  const body = req.body;
  const db = getDb();
  if (db === null) {
    console.log("error: ", "Database Not Found");
    res.status(401).send({
      test: "Error while querying",
    });
  }
  const bountyCollection = db.collection("bounties");
  const applicationCollection = db.collection("applications");

  Promise.all([
    bountyCollection.updateOne(
      { _id: body.applicationData.bountyId },
      { $set: { applicants: body.updatedBountyApplicants } }
    ),
    applicationCollection.insertOne(body.applicationData),
  ])
    .then(() => {
      res.status(201).send({
        test: "Bounty Applicants Updated and Application Posted",
        dataUpdated: body.updatedBountyApplicants,
        dataPosted: body.applicationData,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({
        test: "Your application didn't get Posted",
      });
    });
};

const updateApplicationStatus = async (req, res) => {
  const token = req.headers.authorization;
  if (token === undefined) {
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

  const body = req.body;
  const db = getDb();
  if (db === null) {
    console.log("error: ", "Database Not Found");
    return res.status(401).send({
      test: "Error while querying",
    });
  }

  const bountyCollection = db.collection("bounties");
  const applicationCollection = db.collection("applications");

  const appId = new ObjectId(req.params.id);
  console.log(appId, body.bounty_id);

  Promise.all([
    applicationCollection.updateOne(
      { _id: appId },
      { $set: { selectionStatus: true } }
    ),
    bountyCollection.updateOne(
      { _id: body.bounty_id },
      { $set: { bountyStatus: "In Progress" } }
    ),
  ])
    .then((result) => {
      console.log(result);
      res.status(201).send({
        test: "application status changed",
        id: req.params.id,
        data: body,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({
        test: "Your application status didn't get changed",
      });
    });
};

module.exports = {
  getAllApplication,
  postAnApplication,
  updateApplicationStatus,
};
