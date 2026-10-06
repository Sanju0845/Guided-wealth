import mongoose from "mongoose";

const subscriberSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    consent: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: "footer",
    },
  },
  {
    timestamps: true,
  }
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

export default Subscriber;
