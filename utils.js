const userSchema = require("./userModel");

exports.createCookie = (name, value, res) => {
  const arr = new Array();
  arr.push(value);
  res.cookie(name, arr, { httpOnly: true });
}

exports.notAuthorizedError = (req, res) => {
  this.createCookie("errors", { msg: req.authError }, res);
  res.redirect("/login");
}

exports.getUser = (handler) => {
  return userSchema
    .findOne({ $or: [{ username: handler }, { email: handler }] })
    .then((user) => user);
};
