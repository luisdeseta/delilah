const express = require('express');
const app = express();
const bodyparser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const sequelize = require('./services/conexion');
const expressJwt = require('express-jwt');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Importar Rutas
const {routerP, Prod} = require('./rutas/productos');
const {router, User}= require('./rutas/usuarios');
const {routerI} = require('./rutas/pedidos')
const {routerF} = require('./rutas/favoritos');

//Middlewares
const expJWT = expressJwt({ secret: process.env.SECRET_TOKEN, algorithms: ['HS512'] });

//Rutas
app.use('/api', routerP);
app.use('/api', router); 
app.use('/api', routerI);
app.use('/api', routerF)

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
}); 


app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

