const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      dbName: "Simple-Assessment",
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(`Database is connected on ${con.connection.host}`);
    })
    .catch((e) => console.error(e));
};
module.exports = connectDatabase;
