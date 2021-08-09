const express = require('express');
const app = express();
const bodyparser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT;
const sequelize = require('./services/conexion');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Importar Rutas
const productos = require('./rutas/productos');
const {router, User}= require('./rutas/usuarios');
const admin = require('./rutas/admin');

//Middlewares
const {validToken, validUser} = require('./services/middle')
//const algo = require('./services/middle');
//Rutas

app.use('/api', productos);
app.use('/api',router); 
app.use('/api/admin',validToken, validUser, admin);

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
}); 


app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

