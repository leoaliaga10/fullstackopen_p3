const mongoose = require("mongoose");

// process.argv.forEach((val, index) => {
//   console.log(`${index}: ${val}`);
// });

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const arg_name = process.argv[3];
const arg_number = process.argv[4];

const url = `mongodb+srv://leoas10:${password}@cluster0.w4pgfmb.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (arg_name && arg_number) {
  const person = new Person({
    name: `${arg_name}`,
    number: arg_number,
  });

  person
    .save()
    .then((result) => {
      console.log(`added ${arg_name} number ${arg_number} to phonebook`);
      //mongoose.connection.close();
    })
    .catch((error) => {
      console.error("Error saving person:", error);
    })
    .finally(() => {
      mongoose.connection.close();
    });
} else {
  Person.find({})
    .then((result) => {
      result.forEach((person) => {
        console.log(person);
      });
      //mongoose.connection.close();
    })
    .catch((error) => {
      console.error("Error fetching persons:", error);
    })
    .finally(() => {
      mongoose.connection.close();
    });
}
