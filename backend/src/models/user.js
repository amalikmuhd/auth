const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const { JWT_PRIVATE_KEY } = process.env;
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 4,
      maxlength: 100,
    },
    lastName: {
      type: String,
      minlength: 4,
      maxlength: 100,
    },
    email: {
      type: String,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    phoneNumber: {
      type: String,
      minlength: 4,
      maxlength: 100,
    },

    password: {
      type: String,
      minlength: 5,
      maxlength: 1024,
    },
  },
  {
    collection: "users",
  }
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, JWT_PRIVATE_KEY);
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    firstName: Joi.string().min(3).max(255),
    lastName: Joi.string().min(3).max(255),
    email: Joi.string().min(5).max(255).required().email(),
    phoneNumber: Joi.string(),
    password: Joi.string().min(5).max(255),
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
