"use strict";
module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        first_name: DataTypes.STRING(50),
        last_name: DataTypes.STRING(50),
        email: DataTypes.STRING(50),
        password: DataTypes.STRING(100),
        dob: DataTypes.DATE(),
        role: DataTypes.STRING(20)
    }, {
        tableName: "user",
        timestamps: false,
        underscored: true
    });
    return user;
};
