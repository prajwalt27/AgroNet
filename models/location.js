const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  _id: Object,
  name: String,
  crops: [
    {
      name: {
        type: String,
        required: true,
      },
      introduction: {
        type: String,
        required: true,
      },
      soil: {
        type: String,
        required: true,
      },
      sowing: {
        type: String,
        required: true,
      },
      fertilizers: {
        type: String,
        required: true,
      },
      weed_management: {
        type: String,
        required: true,
      },
      yield: {
        type: String,
        required: true,
      },
      msp: {
        type: String,
        required: true,
      },
      month: {
        type: String,
        required: true,
      },
      schedule: {
        type: Object,
        require: true,
      },
    },
  ],
});

module.exports = mongoose.model("locations", locationSchema);
