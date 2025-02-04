require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

// I'm just using an environment variable here as I can't be arsed to type the autogenerated strong password every time for the CLI DB assignment
const url = process.env.MONGO_DB_URI;
const name = process.argv[2];
const number = process.argv[3];

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: name,
  number: number,
});

if (process.argv.length < 3) {
  Person.find({}).then((result) => {
    console.log("Contacts:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then((result) => {
    console.log(`Added ${person.name} ${number} to contacts`);
    mongoose.connection.close();
  });
}
