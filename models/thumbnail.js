import mongoose from "mongoose";

const thumbnail = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
    required: true,
    unique: true,
  },
});

const Thumbnail = mongoose.model("Thumbnail", thumbnail);

export default Thumbnail;
