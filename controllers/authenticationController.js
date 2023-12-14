const userSchema = require("./../userModel");
const bcrypt = require("bcrypt");
const { getUser, createCookie } = require('./../utils');
const jwt = require('jsonwebtoken')

function createToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRY });
}

exports.login = (req, res, next) => {
  getUser(req.body.handler)
    .then(async (user) => {
      if (
        !user ||
        !(await bcrypt.compare(req.body.password, user.password))
      ) {
        const error = new Error();
        error.msg = "Incorrect Handler or Password";
        const arr = [error]
        next(arr);
      } else {
        const token = createToken(user);
        createCookie("token", token, res);
        res.redirect("/profile");
      }
    })
    .catch((error) => {
      next(error);
    });
};

exports.signUp = (req, res, next) => {
  const user = new userSchema(req.body);
  user
    .save()
    .then(() => {
      const token = createToken(user);
      createCookie("token", token, res);
      res.redirect("/profile");
    })
    .catch((error) => {
      next(error);
    });
  
};
