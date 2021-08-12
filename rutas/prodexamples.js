const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize');
//const seq = require('../services/conexion');
const {Prod} = require('./productos');
const { query } = require('express');

async function productsExample() {
    try {
        await query (`
        INSERT into platos (name, shortname, price, description,photo, available)
        values 
        ('Ensalada de Palta', 'EnsPalt', '150,00', 'Ensalada de palta y semillas', 'url', '1'),
        ('Hamburguesa de Carne', 'HamCarne', '250,00', 'Hamburguesa de carne completa', 'url', '1'),
        ('Hamburguesa de Cordero', 'HamCord', '350,00', 'Hamburguesa de cordero con cebollas', 'url', '1')
        `, {type: QueryTypes.INSERT}
        )
        console.log("Platos de ejemplos creados con éxito")
        
    } catch (error) {
        console.log(error);        
    }
};

productsExample();