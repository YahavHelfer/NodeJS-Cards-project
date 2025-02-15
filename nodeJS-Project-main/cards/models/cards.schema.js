import { Schema, model } from "mongoose";

const cardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  web: {
    type: String,
  },
  image: {
    url: {
      type: String,
      required: true,
      default:
        "https://img.freepik.com/free-vector/abstract-grunge-style-coming-soon-with-black-splatter_1017-26690.jpg?semt=ais_hybrid",
    },
    alt: {
      type: String,
      required: false,
    },
  },
  address: {
    state: {
      type: String,
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
    },
    zip: {
      type: Number,
      required: true,
    },
  },
  bizNumber: {
    type: Number,
    required: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: "user",
    required: false,
  },
});

const Card = model("Card", cardSchema);
export default Card;
