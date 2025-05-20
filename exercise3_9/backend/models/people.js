import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const peopleSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: Number, //In my country, telephone numbers are numbers without hyphens.
    minLength: 8,
    validate: {
      validator: function (value) {
        return value.toString().length >= 8;
      },
      message: (props) =>
        `${props.value} is not a valid phone number! It must have at least 8 digits.`,
    },
  },
});

peopleSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

//module.exports = mongoose.model("Person", personSchema);
export default mongoose.model("People", peopleSchema, "people");
