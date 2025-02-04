const mongoose = require("mongoose");

const url = process.env.MONGO_DB_URI;

console.log("Attempting to connect to MongoDB");

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (v) {
        // 2-3 digits - at least 4 digits
        return /^\d{2,3}-\d{4,}/.test(v);
      },
      message:
        "The phone number should have 2-3 digits, a hyphen, and at least 4 digits. (e.g., 867-5309)",
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
