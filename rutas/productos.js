const routerP = require('express').Router();
const sequelize = require('../services/conexion');
const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize');
const { query } = require('express');

//Middlewares
const {validToken, validUser} = require('../services/middle')

//Creacion de modelo de Producto

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
 * @description Trae los datos de un producto
 * 
 */

routerP.get('/product', validToken, async (req, res) => {
    try {
        const prodByName = await Prod.findAll({
            where: { name: req.body.name}
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
 * @description Crear un producto en la tabla platos
 * TODO validación de producto repetido
 */
routerP.post('/product', (req, res) => {
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
 * @description actualiza un producto por id en la tabla productos
 * 
 */
routerP.put('/product', validToken,validUser,async (req, res) => {
    try {
        await query(`
        UPDATE products set price = :_price, name = :_name
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
 * @description Borra un producto por ID
 * 
 */

routerP.delete('/product', validToken, validUser, async (req, res) =>{
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
 * @description Trae la lista de todos los productos
 */
routerP.get('/products', validToken, (req, res) => {
    query("select * from products", 
    { type: QueryTypes.SELECT} )
    .then( (list) => {
	    res.send(list);
    });
}); 

module.exports = {routerP, Prod}