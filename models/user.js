const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const userSchema = new mongoose.Schema({
  baandaId: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  confirmCode: {
    type: Number,
    default: 0
  },
  confirmBy: {
    type: Date,
    default: null
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { baandaId: this.baandaId, name: this.name, isAdmin: this.isAdmin, email: this.email },
    keys.jwtSecretKey
  );
  return token;
};

module.exports = User = mongoose.model("users", userSchema);
