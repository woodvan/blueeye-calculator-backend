const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

router.post("/login", authController.login);
router.post("/register", authMiddlewares.verifySignUp, authController.register);
router.post("/currentUser", authMiddlewares.verifyToken, authController.currentUser);

module.exports = router;
