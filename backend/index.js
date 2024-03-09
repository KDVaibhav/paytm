const express = require("express");
const {connectDB} = require("./db");
const rootRouter = require("./routes/index");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/v1", rootRouter);

app.listen(3000);