const mongoose = require("mongoose");
const Assignment = require("./assignment");

const schema = mongoose.Schema(
  {
    _id: String,
    title: String
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("User", schema);
