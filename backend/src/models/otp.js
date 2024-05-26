const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  otp: String,
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
  },
  createdAt: Date,
  expiresAt: Date,
});

const OTP = mongoose.model("OTP", OTPSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255),
  };
  return Joi.validate(user, schema);
}

exports.OTP = OTP;
exports.validate = validateUser;
