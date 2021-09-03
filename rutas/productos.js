const routerP = require('express').Router();
const sequelize = require('../services/conexion');
const { Sequelize, DataTypes, Model, QueryTypes, Op } = require('sequelize');
const { query } = require('express');
const expressJwt = require('express-jwt');
require('dotenv').config()
const expJWT = expressJwt({ secret: process.env.SECRET_TOKEN, algorithms: ['HS512'] });

/**
 * @description Creacion del modelo de productos
 * @param platos nombre de la tabla "platos"
 */

const Prod = sequelize.define("platos", {
    name: { 
        type: DataTypes.TEXT,
        allowNull: false,
        validate:{
            notNull: "name de producto no puede ser null"
        }
    },
    shortname: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate:{
            notNull: "shortname de producto no puede ser null"
        }
    }, 
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validate:{
            notNull: "price de producto no puede ser null"
        }
    },
    description: DataTypes.TEXT,
    photo: DataTypes.TEXT,
    available: DataTypes.INTEGER
  },
  {
    timestamps: false
  });
  

/**
 * Condicion 5 - Read
 * @description Trae los datos de un producto
 * @param name recibe nombre de producto por body
 * 
 */

routerP.get('/product', expJWT, async (req, res) => {

    try {
        const prodByName = await Prod.findAll({
            where: { name: {[Op.like]:`%${req.body.name}%` }}
        });
        //console.log(prodByName)
        if (prodByName.length === 0) {
            res.json({Status: "Producto no encontrado"})
        } else{
            res.json({prodByName}) 

        }
    } catch (error) {
        res.json({Status: "Error en la sentencia SQL"})
    }
})
/**
 * Condicion 5 - Create
 * @description Crear un producto en la tabla platos
 * 
 */
routerP.post('/product',expJWT, async (req, res) => {
    if (req.user.role != "admin") return res.status(401).json({Status: "acceso denegado"})
    console.log(req.user.role)
    //valido si producto existe
    const verifyProd = await sequelize.query(`SELECT * from platos 
    WHERE name ='${req.body.name}' 
    `, {type: sequelize.QueryTypes.SELECT})
    //console.log("verifyProd", JSON.stringify(verifyProd, null,2))
    if (verifyProd.length != 0) return res.status('401').json({Mensaje: "Ya existe un producto con ese nombre"})
    try {
        sequelize.query(`
        INSERT into platos (name, shortname, price, description, photo, available)
        values (:_name, :_shortname, :_price, :_description, :_photo,:_available)
        `,{
            type: QueryTypes.INSERT,
            replacements:{
                _name: req.body.name,
                _shortname: req.body.shortname,
                _price: req.body.price,
                _description: req.body.description,
                _photo: req.body.photo,
                _available: req.body.available
            }
    
        })
        res.json({Status: 'Producto creado con éxito'})
        
    } catch (error) {
        res.json({Status: "error al crear el producto"})
        
    }

});

/**
 * Condicion 5 - Update
 * @description actualiza un producto por id en la tabla productos
 * 
 */
routerP.put('/product', expJWT,async (req, res) => {
    if (req.user.role != "admin") return res.status(401).json({Status: "acceso denegado"})
    console.log(req.user.role)
    try {
        const prodUpdate = await sequelize.query(`
        UPDATE platos set price = :_price, name = :_name, shortname = :_shortname,
        description = :_description
        WHERE id = :_id
        `,{
            type: QueryTypes.UPDATE,
            replacements:{
                _id: req.body.id,
                _name: req.body.name || undefined,
                _shortname: req.body.shortname || undefined,
                _price: req.body.price || undefined, 
                _description: req.body.description || undefined
            }
    
        })
        res.json({
            Status: "Actualizado con éxito"})
        
    } catch (error) {
        res.json({Status: "Error al actualizar el producto"})
    }

});

/**
 * Condicion 5 - Delete
 * @description Borra un producto por ID
 * 
 */

routerP.delete('/product', expJWT, async (req, res) =>{
    if (req.user.role != "admin") return res.status(401).json({Status: "acceso denegado"})
    console.log(req.user.role)
    try {
        const prodByID = await Prod.destroy({
            where: { ID: req.body.ID}
        }); 
        if (prodByID === 0) {
            res.json({Status: "Producto no encontrado"})
        } else{
            res.json({Status: `Producto borrado!`}) 

        }
    } catch (error) {
        res.json({Status: "Error en la sentencia SQL"})
    }
})
/**
 * CONDICION 2
 * @description Trae la lista de todos los productos
 */
routerP.get('/products', expJWT, async (req, res) => {
    const products = await sequelize.query("select * from platos", 
    { type: QueryTypes.SELECT} )
    res.status(200).json({products})
}); 

module.exports = {routerP, Prod}