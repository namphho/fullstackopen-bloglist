const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [3, "user length must be greater than 3 character"],
    unique: true,
  },
  name: String,
  passwordHash: String,
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

// userSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//     //the passwordHash should not be revealed
//     delete returnedObject.passwordHash;
//   },
// });

module.exports = mongoose.model("User", userSchema);
