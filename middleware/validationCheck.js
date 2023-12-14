const { validationResult } = require("express-validator");

exports.validationCheck = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(errors.array());
    }
    else next();
}