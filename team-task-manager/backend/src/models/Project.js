const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [2, "Project title must be at least 2 characters"],
      maxlength: [100, "Project title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Project description cannot exceed 1000 characters"],
      default: "",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project creator is required"],
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ createdBy: 1 });
projectSchema.index({ members: 1 });

module.exports = mongoose.model("Project", projectSchema);
