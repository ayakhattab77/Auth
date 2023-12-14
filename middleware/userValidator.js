const { body } = require('express-validator');
const { getUser } = require("./../utils")

exports.getUserValidator = [
    body("handler").notEmpty().withMessage("Handler Required"),
    body("password").notEmpty().withMessage("Password Required")
]

exports.createUserValidator = [
    body("email").notEmpty().withMessage("Email Required")
    .custom(async (email) => {
        const user =  await getUser(email)
        if(user)
            return Promise.reject(new Error(""))
        return true
    }).withMessage("Email already in use")
    .isEmail().withMessage("Invalid Email")
    ,
    body("username").notEmpty().withMessage("Username Required")
    .isLength({min: 3}).withMessage("Username should be > 3")
    .custom(async (username) => {
        const user = await getUser(username);
        if(user)
            return Promise.reject(new Error(""))
        return true
    }).withMessage("Username already in use")
    .isAlphanumeric().withMessage("Username can only contain alphabet and numbers")
    ,
    body("name").notEmpty().withMessage("Name Required")
    ,
    body("password").notEmpty().withMessage("Password Required")
    .isLength({min: 6}).withMessage("Password should be > 6")
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("Password should contain at least one number, one symbol and both lower and uppercase characters.")
    ,
    body("passwordConfirm").notEmpty().withMessage("Password Confirmation required")
    .custom((passConf, { req }) => {
        if(passConf !== req.body.password)
            return false;
        return true;
    }).withMessage("Password doesn't match.")
    ,
    body("mobile").isMobilePhone("ar-EG").withMessage("Phone number must be Egyptian.")
]

exports.changePasswordValidator = [
    body("password").notEmpty().withMessage("Password Required")
    .isLength({min: 6}).withMessage("Password should be > 6")
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("Password should contain at least one number, one symbol and both lower and uppercase characters."),
    body("passwordConfirm").notEmpty().withMessage("Password Confirmation required")
    .custom((passConf, { req }) => {
        if(passConf !== req.body.password)
            return false;
        return true;
    }).withMessage("Password doesn't match.")
]