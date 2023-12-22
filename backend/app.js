const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const sectorRoutes = require("./routes/sector.routes");

const connectDatabase = require("./database/connection");
const handleError = require("./middleware/error");

connectDatabase();
const app = express();
app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(sectorRoutes);

app.use(handleError);

module.exports = app;
