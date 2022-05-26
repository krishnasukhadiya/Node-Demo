import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const userController = require("./controller/user.controller");
const blogsController = require("./controller/blogs.controller");
app.use("/user", userController);
app.use("/blog", blogsController);

app.get("/", (req, res) => {
    res.send("Demo api");
});

app.listen(process.env.PORT, () => {
    console.log("server started at port:", process.env.PORT);
})