const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const recordSchema = mongoose.Schema(
  {
    operation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Operation",
        unique: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: false,
    },
    amount: {
        type: Number,
        required: true,
    },
    userBalance: {
        type: Number,
        required: true,
    },
    operationResponse: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

recordSchema.plugin(mongooseLeanVirtuals);

const Record = mongoose.model("Record", recordSchema);
module.exports = Record;
