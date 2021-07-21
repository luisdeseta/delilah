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
//Rutas

//const productos = require('./rutas/productos')
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});
app.get('/productos', (req, res) => {
    sequelize.query("select * from productos", 
    { type: sequelize.QueryTypes.SELECT} )
    .then( (list) => {
	    res.send(list);
});
});

// prueba creacion de modelo

const User = sequelize.define("producto", {
    name: DataTypes.TEXT,
    favoriteColor: {
      type: DataTypes.TEXT,
      defaultValue: 'green'
    },
    age: DataTypes.INTEGER,
    cash: DataTypes.INTEGER
  });
  

app.post('/creartabla', async (req, res) => {
    await User.sync();
    const jane = await User.create({name: 'luis', favoriteColor: 'vede',age: 23, cash: 333})
    //console.log(res.send(productos))
    res.send('ok');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puesrto ${PORT}, YEAH!!!`);
});