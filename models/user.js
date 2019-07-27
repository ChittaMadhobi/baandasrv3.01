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
  personalInfo: {
    hommeGeoAddress: {
      streetAddress: {
        type: String,
        default: ""
      },
      city: {
        type: String,
        default: ""
      },
      State: {
        type: String,
        default: ""
      },
      country: {
        type: String,
        default: "USA"
      },
      zip: {
        type: String,
        default: ""
      },
      ipAddress: {
        address: '',
        default: ''
      },
      geoLocation: {
        latitude: {type: String, default: ''},
        longitude: {type: String, default: ''}

      }
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
    }
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
