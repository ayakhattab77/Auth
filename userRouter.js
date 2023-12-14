const express = require("express");
const userController = require("./controllers/userController.js");
const authenticationController = require("./controllers/authenticationController.js");
const {
  createUserValidator,
  getUserValidator,
  changePasswordValidator,
} = require("./middleware/userValidator.js");
const authorizationMW = require("./middleware/authorization.js");
const loggedInMW = require("./middleware/loggedIn.js");
const userRouter = express.Router();
const expressFileUpload = require("express-fileupload");
const { validationCheck } = require("./middleware/validationCheck.js");

function checkErrorsAndView(req, res, view) {
  const { errors } = req.cookies;
  if (errors ) {
    const err = errors;
    res.clearCookie("errors");
    res.render(view, { errors: err });
  } else {
    res.render(view);
  }
}

userRouter.get("/", authorizationMW, (req, res, next) => {
  res.redirect("profile");
});

userRouter
  .route("/login")
  .get(authorizationMW, loggedInMW, (req, res) => {
    checkErrorsAndView(req, res, "login");
  })
  .post(getUserValidator, validationCheck, authenticationController.login);

userRouter
  .route("/signup")
  .get(authorizationMW, loggedInMW, (req, res) => {
    checkErrorsAndView(req, res, "signup");
  })
  .post(
    expressFileUpload(),
    createUserValidator,
    validationCheck,
    (req, res, next) => {
      if(req.files){     
        const { uploaded_file } = req.files;
        const { username } = req.body;
        uploaded_file.mv(
          __dirname +
            "/public/" +
            username +
            "." +
            uploaded_file.name.split(".")[1]
        );
      }
      next();
    },
    authenticationController.signUp
  );

userRouter.get("/profile", authorizationMW, userController.viewProfile);

userRouter
  .route("/changePassword")
  .get((req, res) => {
    checkErrorsAndView(req, res, "changepassword");
  })
  .post(
    authorizationMW,
    changePasswordValidator,
    userController.changePassword
  );

userRouter.get("/logout", authorizationMW, userController.logout);

userRouter.get(
  "/keepMeLoggedIn",
  authorizationMW,
  userController.keepMeLoggedIn
);

module.exports = userRouter;
