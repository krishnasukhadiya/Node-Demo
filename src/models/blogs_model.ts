module.exports = function (sequelize: any, DataTypes: any) {
    var blogs = sequelize.define('blogs', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        title: DataTypes.STRING(200),
        description: DataTypes.STRING(),
        publish_date: DataTypes.DATE(),
        modify_date: DataTypes.DATE(),
        status: DataTypes.STRING(20),
        category: DataTypes.STRING(20),
        author: DataTypes.INTEGER(11)
    }, {
        tableName: "blogs",
        timestamps: false,
        underscored: true
    });
    return blogs;
}