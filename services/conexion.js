const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.HOST,
    dialect: 'mysql',
    loggin: false,
    freezeTableName: true

});
module.exports = sequelize;