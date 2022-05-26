"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
const userController = require("./controller/user.controller");
const blogsController = require("./controller/blogs.controller");
app.use("/user", userController);
app.use("/blog", blogsController);
app.get("/", (req, res) => {
    res.send("Demo api");
});
app.listen(process.env.PORT, () => {
    console.log("server started at port:", process.env.PORT);
});
