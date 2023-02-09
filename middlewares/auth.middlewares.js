const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/auth.config.js");

module.exports = {
  verifyToken: async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }

    try {
      const decoded = jwt.verify(token, config.access_token_secret);
      const currentUser = await User.findOne({id: decoded.id});
      req.user = currentUser;
    } catch (error) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }

    next();
  },

  verifySignUp: async (req, res, next) => {
    let user = await User.findOne({
      email: req.body.email
    });
    
    if (user) {
      res.status(400).send({
        message: "Failed!, the email is already in use!"
      });
      return;
    }
    
    next();
  }
};
