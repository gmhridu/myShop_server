const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    notes: String,
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", AddressSchema);
module.exports = Address;
