const router = require('express').Router();
const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize');
// const sequelize = require('../index.js') se puede requerir desde index

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


//Creacion de modelo de Producto

const Prod = sequelize.define("product", {
    name: DataTypes.TEXT,
    shortname: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    
  },
  {
    timestamps: false
  });
  
/**
 *  @description Crea la tabla productos si no existe
 * 
 * */ 
router.post('/createtable', async (req, res) => {
    try {
        await Prod.sync();
        res.json({Mensaje: `Tabla ${Prod.tableName} creada con éxito`});
        
    } catch (error) {
        res.json({error})        
    }
});

/**
 * @description Crear un producto en la tabla PRODUCTS
 * 
 * TODO AGREGAR MANEJO DE ERRORES
 */

router.post('/createproduct', async (req, res) => {
    await sequelize.query(`
    INSERT into products (name, shortname, price, description)
    values (:_name, :_shortname, :_price, :_description)
    `,{
        type: sequelize.QueryTypes.INSERT,
        replacements:{
            _name: req.body.name,
            _shortname: req.body.shortname,
            _price: req.body.price,
            _description: req.body.description
        }

    })
    res.json({Status: 'Producto creado con éxito'})
});

/**
 * @description actualiza un producto por id en la tabla productos
 * TODO AGREGAR MANEJO DE ERRORES
 */
router.put('/createproduct', async (req, res) => {
    await sequelize.query(`
    UPDATE products set price = :_price, name = :_name
    WHERE id = :_id
    `,{
        type: sequelize.QueryTypes.UPDATE,
        replacements:{
            _id: req.body.id,
            _name: req.body.name,
            _shortname: req.body.shortname,
            _price: req.body.price,
            _description: req.body.description
        }

    })
    res.json({Status: "Update ok"})
});


router.get('/products', (req, res) => {
    sequelize.query("select * from products", 
    { type: sequelize.QueryTypes.SELECT} )
    .then( (list) => {
	    res.send(list);
    });
}); 
module.exports = router