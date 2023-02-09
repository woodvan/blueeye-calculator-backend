const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const operationSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["addition", "subtraction", "multiplication", "division", "square_root", "random_string"],
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

operationSchema.plugin(mongooseLeanVirtuals);

const Operation = mongoose.model("Operation", operationSchema);
module.exports = Operation;
