const sequelize = require('../services/conexion');
const routerI = require('express').Router();
const { Sequelize, DataTypes, Model, QueryTypes, Op, json } = require('sequelize');
const { query } = require('express');
const moment = require('moment');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const expJWT = expressJwt({ secret: process.env.SECRET_TOKEN, algorithms: ['HS512'] });

//Todas las rutas de pedidos.js estan escritas en RAW query


/**
 * CONDICION 3 - Create
 * @description Tabla PEDIDOS. Crear un pedido vacio,
 * Verifica si tiene un pedido en estado "nuevo", 
 * si lo tiene devuelve el ID de pedido en "nuevo",
 * Si NO lo tiene crea el ID de pedido y devuele el ID. 
 * el endpont UPDATE llenara con los datos que vienen
 * de la tabla ITEMS
 * 
 */
routerI.post('/order',expJWT, async (req, res) =>{
    const token = req.user
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
        //Devuelve el ID de Pedido
        const [order_id, od] = await sequelize.query(`
        SELECT id FROM pedidos WHERE usuario_id = ${token.id}
        and status = 'nuevo'`,
        {type: QueryTypes.query});
        return res.status(200).json({
            newOrderID: order_id    })
            
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
 * CONDICION 3 - Create
 * @description Tabla de ITEMS
 * tiene que tener un pedido_id valido. Lo recibe por URL
 * @param idOrder ID del pedido
 * 
 */
 routerI.post('/item/:idOrder', expJWT, async (req, res) =>{
    const token = req.user;
    const orderID = req.params.idOrder;
    if (!token) {
        res.status(401).json({status: "Debe ser usuario registrado"})
    } else {
        //Inserto un producto en la tabla
        try {
            const [newItem] = await sequelize.query(`
            INSERT into items (pedido_id,plato_id,quantity,item_price)
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
            //console.log({newItem: newItem})
    
        } catch (error) {
            res.status(401).json({mensaje: "Verificar número de orden o id producto",error,})
        }
        

    }
})

/**
 * CONDICION 4
 * @description Tabla item actualizacion de platos en tabla Items
 * @param {id, plato_id, quantity, price} parametros de la tabla items
 * para actualizar
 */
 routerI.put('/item', expJWT, async (req, res) =>{
    const token = req.user;
    if (token.role != "admin") return res.status(401).json({mensaje: "Usuario no autorizado"}) 
    try {
        const [itemUpdate] = await sequelize.query(`
        UPDATE items set plato_id = :_plato_id, quantity= :_quantity, item_price= :_price
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
        res.status(200).json({mensaje: "pedido actualizado"});
        

    } catch (error) {
        res.status(400).json({error})
    }
})

/**
 * CONDICION 4 Update
 * @description Tabla pedidos => actualizacion de pedidos
 * @TODO admin actualiza todos los pedidos, user solo 1
 */

routerI.put('/order', expJWT, async (req, res) =>{
    //traigo los items de ese pedido
    let total = 0 ;
    let desc ="";
    try {
        const items = await sequelize.query(`
            SELECT * FROM items left join (platos) on (items.plato_id = platos.id)
            WHERE items.pedido_id = :_pedido_id
        `,{
            type: QueryTypes.SELECT,
            replacements:{
                _pedido_id: req.body.pedido_id
            }
        })
        console.log(items); 
        items.forEach(i =>{
            total +=  (i.quantity * i.item_price)
            desc = desc + i.quantity +"x "+ i.shortname+" "
        })
        console.log("total =>  " + total);
        console.log("desc =>   "+desc)

        
        
    } catch (error) {
        res.status(401).json({error: error});
    }
    //UPDATE de datos de pedido
    const token = req.user;
    //User puede actualizar medio de pago
     if (token.role == "user") {
        const pedido = await sequelize.query(`
        UPDATE  pedidos set payment = :_payment
        WHERE id= :_id
        `,{
            type: QueryTypes.UPDATE,
            replacements:{
                _id: req.body.pedido_id,
                _payment: req.body.payment,
            }
        })
        res.status(200).json({total, desc})
    } else if (token.role == "admin") {
        const pedido = await sequelize.query(`
        UPDATE  pedidos set payment = :_payment, status = :_status, total = ${total}
        WHERE id= :_id
        `,{
            type: QueryTypes.UPDATE,
            replacements:{
                _id: req.body.pedido_id,
                _payment: req.body.payment,
                _status: req.body.status
            }
        })
        
        //res.json({filas_actualizadas: pedido[1]});
        res.status(200).json({total, desc})
    } else {
        return res.status(401).json(sequelize.error)
    } 
})


/**
 * Condicion 4 - Read
 * @description Devuelve todos los pedidos
 *  
 */
routerI.get('/item', expJWT, async (req, res) =>{
    //req.user es una funcion de express-jwt
    const token = req.user
    //trae todos los pedidos del usuario indicados en el body
    //si no se pasa parametro trae los pedidos en "nuevo"
    if (token.role == "user") {
        const [items] = await sequelize.query(`
        SELECT * from items left join (pedidos )
        on (items.pedido_id=pedidos.id)
        left join (platos)on (items.plato_id=platos.id)
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
        left join (platos)on (items.plato_id=platos.id)
        ORDER by (pedidos.date) desc
        `, { type: DataTypes.SELECT,
            //replacements:{status: req.body.status || "nuevo" }
        });
        res.status(200).json({itemss: items})
        console.log({itemss: items})

    } else { 
        return res.status(400).send(sequelize.error)
    }

})


/**
 * @description devuelve el detalle de 1 pedido
 * 
 */
routerI.get('/item/user', expJWT, async (req, res) =>{
    const token = req.user;
    const [oneItem] = await sequelize.query(`
    SELECT * FROM  items left join (pedidos) 
    on (items.pedido_id  = pedidos.id)
    WHERE (pedidos.id = :_pedidoID) 
    `, {
        type: QueryTypes.SELECT,
        replacements: {
            _pedidoID: req.body.pedidoID
        }
    });
    const itemUser = await sequelize.query(`
    SELECT * FROM  pedidos left join (usuarios) 
    on (pedidos.usuario_id = usuarios.id)
    WHERE (pedidos.id = :_pedidoID) 
    `, {
        type: QueryTypes.SELECT,
        replacements:{
            _pedidoID: req.body.pedidoID
        }
    })
    res.status(200).json({oneItem, itemUser})
    

})

/**
 * Condicion 4 - Delete
 * @description Role Admin puede borrar 1 pedido
 */

routerI.delete('/item', expJWT, async (req, res) =>{
    if (req.user.role != "admin") return res.status(401).json({Status: "acceso denegado"}) 
    try {
        const [itemDelete] = await sequelize.query(`
        DELETE from pedidos 
        WHERE id = :_id
        `,{
            type: QueryTypes.delete,
            replacements:{
                _id: req.body.id
            }
        });
        res.status(200).json({mensaje: "pedido borrado con éxito"})
    } catch (error) {
        res.status(400).json({error})
        
    }
})



module.exports = {routerI}