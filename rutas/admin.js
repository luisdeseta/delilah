const router = require('express').Router();
const { Sequelize, DataTypes, Model, QueryTypes, Op} = require('sequelize');

router.get('/', async (req, res) =>{
    res.json({
      Mensaje: "Mi ruta protegida"
    })
})

module.exports = router