const routerF = require('express').Router();
const sequelize = require('../services/conexion');
const { Sequelize, DataTypes, Model, QueryTypes, Op } = require('sequelize');
const { query } = require('express');
const expressJwt = require('express-jwt');
require('dotenv').config()
const expJWT = expressJwt({ secret: process.env.SECRET_TOKEN, algorithms: ['HS512'] });
//crea la tabla favoritos
/**
 * @description Guarda un plato la tabla de favoritos junto con
 * el ID del usuario logueado
 * 
 */

routerF.post('/fav', expJWT, async (req, res) =>{
    if (!expJWT) return res.status(401).json({Error: "Usuario no autorizado"})
    try {
        const fav = await sequelize.query(`
        INSERT into favoritos (usuario_id, plato_id)
        values (:_usuario_id, :_plato_id)
        `,{
            type: QueryTypes.INSERT,
            replacements:{
                _usuario_id: req.user.id,
                _plato_id: req.body._plato_id
            }
        })
        res.status(200).json("Plato agregado a favoritos")
    } catch (error) {
        res.status(404).json(error)
    }
})

/**
 * @description Borra un plato de la tabla favoritos
 * según el User logueado
 * 
 */


routerF.delete('/fav', expJWT, async (req, res) =>{
    if (!expJWT) return res.status(401).json({Error: "Usuario no autorizado"})
    try {
        const fav = await sequelize.query(`
        DELETE FROM favoritos
        WHERE usuario_id = :_usuario_id and plato_id = :_plato_id
        `, {
            type: QueryTypes.DELETE,
            replacements:{
                _usuario_id: req.user.id,
                _plato_id: req.body._plato_id
            }
        })
        res.status(200).json("Plato eliminado de favoritos")

    } catch (error) {
        res.status(404).json(error)
    }    

})
module.exports = {routerF};


// PUT, DELETE para el usuario

//GET le paso id usuario y hago join de platos y favoritos 
//para mostrarlo en front

