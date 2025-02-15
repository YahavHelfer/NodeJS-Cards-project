
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    first: {
      type: String,
      required: true,
    },
    middle: {
      type: String,
    },
    last: {
      type: String,
      required: true,
    },
  },
  isBusiness: {
    type: Boolean,
  },
  isAdmin: {
    type: Boolean,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    houseNumber: {
      type: Number,
      required: true,
    },
  },
  image: {
    url: {
      type: String,
    },
    alt: {
      type: String,
    },
  },
});

const User = model("User", userSchema);
export default User;