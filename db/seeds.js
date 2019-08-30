const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const config = require("../nodemon.json");
const User = require("../api/models/user");

const reset = async () => {
  mongoose.connect(config.env.MONGO_DB_CONNECTION, { useNewUrlParser: true });
  // Careful with .remove() -- it sends a command directly to the database
  // and skips any mongoose validations
  await User.deleteMany(); // Deletes all records
  return User.create([
    {
      fname: "Jhon",
      lname: "Doe",
      username: "student@student.com",
      password: bcrypt.hashSync("password", 10),
      assignments: [
        {
          title: "HTML5 Resume",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam gravida tincidunt tellus, vel vehicula turpis euismod a.Nulla lobortis mi nec sagittis hendrerit. Sed ultrices metus ut eros interdum, vel blandit mi lacinia.",
          proLink: "http://www.google.com"
        }
      ]
    },
    {
      fname: "Admin",
      lname: "Doe",
      username: "admin@admin.com",
      password: bcrypt.hashSync("password", 10),
      isAdmin: true
    }
  ]);
};

reset()
  .catch(console.error)
  .then(response => {
    console.log(`Seeds successful! ${response.length} records created.`);
    return mongoose.disconnect();
  });
