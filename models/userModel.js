const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

let schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  date_created: {
    type: Date, default: Date.now
  },
  role: {
    type: String, default: "user"
  }
})
exports.UserModel = mongoose.model("users", schema);

exports.createToken = (user_id, role) => {
  let token = jwt.sign({ _id: user_id, role }, process.env.TOKEN, { expiresIn: "60mins" });
  return token;
}

exports.validateJoi = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(1).max(100).email().required(),
    password: Joi.string().min(1).max(50).required(),
  })
  return joiSchema.validate(_reqBody)
}

exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(1).max(100).email().required(),
    password: Joi.string().min(1).max(50).required(),
  })
  return joiSchema.validate(_reqBody)
}