const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

const app = require("./app");
const connectDatabase = require("./database/connection");

const PORT = process.env.PORT || 5000;
connectDatabase();

app.listen(PORT, () => {
  console.log("server started port no :" + PORT);
});
