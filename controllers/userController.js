const userSchema = require("../userModel");
const bcrypt = require("bcrypt");
const { checkValidation } = require('./../utils');

exports.viewProfile = (req, res, next) => {
    const { name, email, username, password, mobile } = req.body.user;
    res.render("profile", { name, email, username, password, mobile });
};

exports.changePassword = async (req, res, next) => {
    const validRes = checkValidation(req);
    if (validRes != true) {
      next(validRes);
    } else {
      const { username } = req.body.user;
      const newDoc = await userSchema.findOneAndUpdate(
        {username},
        {
          password: await bcrypt.hash(req.body.password, 12),
          pwChangeDate: Date.now(),
        },
        {
          new: true,
        }
      );
      res.redirect('/profile');
    }
};

exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.redirect('/login')
}

exports.keepMeLoggedIn = (req, res, next) => {
    res.render('keepMeLoggedIn');
}
