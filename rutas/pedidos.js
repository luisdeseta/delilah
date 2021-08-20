const sequelize = require('../services/conexion');
const routerI = require('express').Router();
const { Sequelize, DataTypes, Model, QueryTypes, Op, json } = require('sequelize');
const { query } = require('express');
const moment = require('moment');
require('dotenv').config()
const jwt = require('jsonwebtoken');
//Todas las rutas de pedidos.js esta escrita en RAW query


/**
 * @description Tabla PEDIDOS. Crear un pedido vacio,
 * Verifica si tiene un pedido en estado "nuevo", 
 * si lo tiene devuelve el ID de pedido en "nuevo",
 * Si NO lo tiene crea el ID de pedido y devuele el ID. 
 * el endpont UPDATE llenara con los datos que vienen
 * de la tabla ITEMS
 * 
 */
routerI.post('/order', async (req, res) =>{
    //traer datos del usuario (id y adress sugerida)
    //TODO tomar los datos del middleware
    //TODO usar express-JWT
    const token = jwt.verify(req.header('token'), process.env.SECRET_TOKEN,);
    
    //verificar si tiene pedido activo para cargar la orden en ese pedido
    const orderActive = await sequelize.query(`
    SELECT * FROM pedidos WHERE usuario_id = ${token.id}
    and status = 'nuevo'
    `,{type: QueryTypes.query});
    console.log(JSON.stringify('orderActive'+orderActive[0], null,2) )
    if (orderActive[0].length == 0) {
        //inserto los datos en la tabla pedidos
        try {
            await sequelize.query(`
            INSERT into pedidos (usuario_id, date, status)
            values (:_usuario_id, :_date, :_status)
            `,{
                type: QueryTypes.INSERT,
                replacements:{
                    _usuario_id: token.id, 
                    _date: moment().format('YYYY/MM/DD HH:mm:ss'), 
                    _status: 'nuevo'
                }
            })

        } catch (error) {
            res.status(400).json({
                mensaje: error
            })
        }
        //
        //Devuelve el ID de Pedido
        const [order_id, od] = await sequelize.query(`
        SELECT id FROM pedidos WHERE usuario_id = ${token.id}
        and status = 'nuevo'`,
        {type: QueryTypes.query});
        return res.status(200).json({
            newOrderID: order_id    })
            //duda: ¿El resultado va por res o por console.log?
    } else {
        //Si tiene pedido activo =>
        //Devuelve el ID de Pedido
        const [order_id, od] = await sequelize.query(`
        SELECT id FROM pedidos WHERE usuario_id = ${token.id}
        and status = 'nuevo'`,
        {type: QueryTypes.query});
        return res.status(200).json({
            Order_ID: order_id    })

    }
    

})

/**
 * @description put de pedido.
 * cuando el usuario ya cargo todo en la tabla items y va al checkout
 */

/**
 * @description delete de pedido
 * cuando el usuario cancela todo
 * borrado en cascada, se borra el pedido junto con
 *  todos los items con ese pedido_di
 * 
 */


/**
 * @description Tabla de items
 * tiene que tener un pedido_id valido. Lo recibe por URL
 * @param idOrder ID del pedido
 */
routerI.post('/item/:idOrder', async (req, res) =>{
    const orderID = req.params.idOrder;
    //Inserto un producto en la tabla
    //TODO si es el mismo ID de producto cambiar cantidad
    //TODO verificar si el id de produco existe
    try {
        const [newItem] = await sequelize.query(`
        INSERT into items (pedido_id,plato_id,quantity,price)
        values (:_pedido_id, :_plato_id, :_quantity, :_price)
        `,{
            type: QueryTypes.INSERT,
            replacements: {
                _pedido_id: orderID,
                _plato_id: req.body.plato_id,
                _quantity: req.body.quantity,
                _price: req.body.price
            }
        });
        res.status(200).json({item: newItem})
        console.log({newItem: newItem})

    } catch (error) {
        res.status(401).json({mensaje: "Verificar número de orden",error,})
    }
})
/**
 * @description Devuelve todos los pedidos
 * 
 * 
 */
routerI.get('/item/', async (req, res) =>{
    //TODO tomar los datos del middleware
    //TODO usar express-JWT
    const token = jwt.verify(req.header('token'), process.env.SECRET_TOKEN,);
    //const itemID = req.params.idOrder;
    //trae todos los pedidos del usuario indicados en el body
    //si no se pasa parametro trae los pedidos en "nuevo"
    if (token.role == "user") {
        const [items] = await sequelize.query(`
        SELECT * from items left join (pedidos )
        on (items.pedido_id=pedidos.id)
        WHERE (pedidos.usuario_id = ${token.id})
        AND (pedidos.status = :status)
        `, { type: DataTypes.SELECT,
            replacements:{
                status: req.body.status || "nuevo"
            }
        });
        res.status(200).json({items: items})
        console.log({items: items})

    } else if (token.role == 'admin'){
        const [items] = await sequelize.query(`
        SELECT * from items left join (pedidos )
        on (items.pedido_id=pedidos.id)
        WHERE (pedidos.status = :status)
        `, { type: DataTypes.SELECT,
            replacements:{
                status: req.body.status || "nuevo"  
            }
        });
        res.status(200).json({itemss: items})
        console.log({itemss: items})

    } else { 
        return res.status(400).send(sequelize.error)
    }

})
/**
 * @description actualizacion de pedidos
 * @TODO solo el ADMIN
 * @param {id, plato_id, quantity, price} parametros de la tabla itemas
 * para actualizar
 */
routerI.put('/item', async (req, res) =>{
    
    try {
        const [itemUpdate] = await sequelize.query(`
        UPDATE items set plato_id = :_plato_id, quantity= :_quantity, price= :_price
        WHERE id = :_id
        `, {
            type: QueryTypes.UPDATE,
            replacements: {
                _id: req.body.id,
                _plato_id: req.body.plato_id,
                _quantity: req.body.quantity,
                _price: req.body.price,
            }
        })
        res.json({mensaje: "pedido actualizado"});
        

    } catch (error) {
        res.json({error})
    }
    
    
})

/**
 * @description delete de pedidos
 * @todo solo admin
 * @param id le pasa por body el id del item para borrar
 * 
 */

routerI.delete('/item', async (req, res) =>{
    try {
        const [itemDelete] = await sequelize.query(`
        DELETE from items
            WHERE id = :_id
        `,{
            type: QueryTypes.delete,
            replacements:{
                _id: req.body.id
            }
        });
        res.json({mensaje: "pedido borrado con éxito"})
    } catch (error) {
        res.json({error})
        
    }
})


//estado de pedido, total, forma de pago, direccion de pedido (la toma desde Usuario)
//validar si tiene pedido en "nuevo" y finalizado

module.exports = {routerI}