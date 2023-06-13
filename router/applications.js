const express = require("express");
const router = express.Router();
const {
  getAllApplication,
  postAnApplication,
  updateApplicationStatus,
} = require("../controller/application");

router.get("/", getAllApplication);

router.post("/", postAnApplication);

router.post("/:id/:status", updateApplicationStatus);

module.exports = router;
