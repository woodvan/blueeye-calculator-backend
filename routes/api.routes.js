const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const mainRouter = require("./main");

router.use("/", authRouter);
router.use("/", mainRouter);

module.exports = router;
