const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, //check what happens if u enter upper
        validate: [validator.isEmail, "Invalid email"]
    },
    username: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Password too short"]
    },
    pwChangeDate: Date,
    mobile: {
        type: String,
        validate: [validator.isMobilePhone, "Invalid phone number"],
        default: "No Phone Number"  
    }
})

userSchema.pre("save", function( next ){
    bcrypt.hash(this.password, 12).then((hashedPW) => {
        this.password = hashedPW;
        next()
    });
})

module.exports = mongoose.model('user', userSchema);
