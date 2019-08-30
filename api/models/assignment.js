const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    desc: { type: String, required: true },
    proLink: {
      type: String,
      required: true
    },
    got: { type: Number },
    total: { type: Number }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = schema;
