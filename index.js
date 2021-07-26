const express = require('express');
const app = express();
const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize');
const bodyparser = require('body-parser');
require('dotenv').config()
const PORT = process.env.PORT;

//conexion a la base de datos
const USER = process.env.DB_USER;
const PASS = process.env.DB_PASS;
const DB = process.env.DB_NAME;
const HOST = process.env.HOST;

const sequelize = new Sequelize(DB, USER, PASS, {
    host: HOST,
    dialect: 'mysql',
    loggin: false,
    freezeTableName: true

})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Importar Rutas
const productos = require('./rutas/productos');
const usuarios = require('./rutas/usuarios');

//Rutas

app.use('/api', productos);
app.use('/api',usuarios); 

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
}); 


app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}, GRAN EQUIPO :3 :) :D!!!!!!`);
});