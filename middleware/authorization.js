const jwt = require('jsonwebtoken');
const userSchema = require('../userModel');
const { createCookie } = require('./../utils');

let request, result, skip;

function notAuthorizedError(msg){
    if(request.originalUrl == "/login" || request.originalUrl == "/signup"){
        request.authorized = false;
        skip()
    }
    else {
        createCookie("errors", { msg }, result);
        result.redirect("/login");
    }
  }

module.exports = (req, res, next) => {
    req.authorized = true;
    request = req;
    result = res;
    skip = next;
    let { token } = req.cookies;
    token = Array.isArray(token) ? token[0] : undefined;
    if(!token){
        notAuthorizedError("Please Log In.");
    }
    else { 
        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded){
            if(err){
                notAuthorizedError("Not authorized, please log in.");
            }
            else {
                userSchema.findById(decoded.userId).then(user => {   
                    if(!user){
                        notAuthorizedError("User doesn't exist");

                    }
                    else if (user.pwChangeDate) {
                        const pwChangeTimeStamp = parseInt(user.pwChangeDate.getTime()/1000, 10);
                        if(pwChangeTimeStamp > decoded.iat){
                            notAuthorizedError("Please Log in again");
                        }
                        else {
                            req.body.user = user;
                            next();
                        }
                    } else {
                        req.body.user = user;
                        next();
                    }
                })
            }
        })
  }
}
