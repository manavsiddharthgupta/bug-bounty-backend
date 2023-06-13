const express = require("express");
const router = express.Router();
const {
  getAllBounty,
  getOneBounty,
  postBounty,
} = require("../controller/bounties");

router.get("/", getAllBounty);

router.get("/:id", getOneBounty);

router.post("/", postBounty);

module.exports = router;
