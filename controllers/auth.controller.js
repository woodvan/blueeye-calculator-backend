var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const config = require("../config/auth.config.js");
const User = require("../models/User");
const buildError = require("../utils/errorBuilder");

module.exports = {
  register: async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      status: 'active',
      cost: 100
    });

    const user = await newUser.save();

    res.json({
      status: 200,
      data: user,
    });
  },

  login: async (req, res, next) => {
    try {
      let user = await User.findOne({
        email: req.body.email,
        status: 'active',
      });

      if (user) {

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return next(buildError("Invalid Password", 401));
        }

        var accessToken = jwt.sign({ id: user._id }, config.access_token_secret, { expiresIn: 86400 });
        var refreshToken = jwt.sign({ id: user._id }, config.refresh_token_secret, { expiresIn: 86400 });

        res.json({
          status: 200,
          data: { user, accessToken, refreshToken},
        });
      } else {
        return next(buildError("User Not Found", 404));
      }

    } catch (err) {
      return next(buildError(err, err.status || 500));
    }
  },

  currentUser: async (req, res, next) => {
    try {
      res.json({
        status: 200,
        data: req.user,
      });
    } catch (err) {
      return next(buildError(err, err.status || 500));
    }
  }
};
