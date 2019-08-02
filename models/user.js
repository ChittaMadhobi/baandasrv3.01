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
  isInitDone: {
    type: Boolean,
    default: false
  },
  isInitProfileDone: {
    type: Boolean,
    default: false
  },
  profileInfo: {
    preferredName: {
      type: String,
      default: ""
    },
    formalName: {
      type: String,
      default: ""
    },
    selfDescription: {
      type: String,
      default: ""
    },
    preferredPronoun: {
      type: String,
      default: ""
    },
    geoCentricInfo: {
      type: String,
      default: ""
    },
    cell: {
      countryCode: {
        type: String,
        default: "1"
      },
      number: {
        type: String,
        default: ""
      }
    },
    // persona: {
    //   O: { type: Number, default: 0 },
    //   C: { type: Number, default: 0 },
    //   E: { type: Number, default: 0 },
    //   A: { type: Number, default: 0 },
    //   N: { type: Number, default: 0 }
    // }
  },
  persona: {
    O: { type: Number, default: 0 },
    C: { type: Number, default: 0 },
    E: { type: Number, default: 0 },
    A: { type: Number, default: 0 },
    N: { type: Number, default: 0 }
  },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      baandaId: this.baandaId,
      name: this.name,
      isAdmin: this.isAdmin,
      email: this.email,
      isInitDone: this.isInitDone
    },
    keys.jwtSecretKey
  );
  return token;
};

module.exports = User = mongoose.model("users", userSchema);
