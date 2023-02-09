const express = require("express");
const router = express.Router();
const mainController = require("../controllers/main.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

router.get("/operations", authMiddlewares.verifyToken, mainController.getOperations);
router.post("/request", authMiddlewares.verifyToken, mainController.requestOperation);
router.post("/records", authMiddlewares.verifyToken, mainController.getRecords);
router.delete("/records/:id", authMiddlewares.verifyToken, mainController.deleteRecord);
module.exports = router;
