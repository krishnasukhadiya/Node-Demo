"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
var sql = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_USER_PW,
    dialect: 'mysql',
    logging: true,
    host: process.env.DB_HOST,
    timezone: "+00:00"
};
var dbwriter = {
    sequelize: new sequelize_1.Sequelize(sql.database, sql.username, sql.password, sql)
};
var dbobject = [{
        "name": dbwriter
    }];
try {
    dbwriter.sequelize.authenticate();
    console.log("Database connected successfully.");
}
catch (error) {
    console.log(error);
}
dbobject.forEach(ele => {
    ele.name['users'] = require("../models/user_model")(ele.name.sequelize, sequelize_1.Sequelize);
    ele.name['blogs'] = require("../models/blogs_model")(ele.name.sequelize, sequelize_1.Sequelize);
});
dbwriter.Sequelize = sequelize_1.Sequelize;
module.exports = { dbwriter };
