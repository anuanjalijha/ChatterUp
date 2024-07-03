import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  username:{
    type:String,
    required:true,
  },
  text: {
    type: String,
    required: true,
  },
  imageUrl :{type: mongoose.Schema.Types.Mixed},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const messageModel = mongoose.model("Message", messageSchema);
