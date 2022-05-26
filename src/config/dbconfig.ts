import { Sequelize } from "sequelize";

var sql: any = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_USER_PW,
    dialect: 'mysql',
    logging: true,
    host: process.env.DB_HOST,
    timezone: "+00:00"
}

var dbwriter: any = {

    sequelize: new Sequelize(sql.database, sql.username, sql.password, sql)
}
var dbobject = [{
    "name": dbwriter
}]
try {
    dbwriter.sequelize.authenticate();
    console.log("Database connected successfully.")
} catch (error) {
    console.log(error)
}
dbobject.forEach(ele => {
    ele.name['users'] = require("../models/user_model")(ele.name.sequelize,Sequelize);
    ele.name['blogs'] = require("../models/blogs_model")(ele.name.sequelize,Sequelize);
})
dbwriter.Sequelize = Sequelize;
module.exports = { dbwriter }