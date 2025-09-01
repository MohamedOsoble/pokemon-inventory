const express = require("express");
const path = require("node:path");
const app = express();
const assetsPath = path.join(__dirname, "public");
const appRouter = require("./routes/routes");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use("/", appRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    };
    console.log(`Express app listening on port ${PORT}!`);
});