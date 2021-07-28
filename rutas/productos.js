const router = require('express').Router();
const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize');
// const sequelize = require('../index.js') se puede requerir desde index


// Constantes


//conexion a la base de datos
const USER = process.env.DB_USER;
const PASS = process.env.DB_PASS;
const DB = process.env.DB_NAME;
const HOST = process.env.HOST;

const sequelize = new Sequelize(DB, USER, PASS, {
    host: HOST,
    dialect: 'mysql',
    loggin: false,
    freezeTableName: true,
    

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
 * TODO detallar en la instrucciones de instalación
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
 * @description Trae los datos de un producto
 * 
 */

router.get('/product', async (req, res) => {
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
 * @description Crear un producto en la tabla PRODUCTS
 * 
 */

router.post('/product', async (req, res) => {
    try {
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
        
    } catch (error) {
        res.json({Status: "error al crear el producto"})
        
    }

});

/**
 * @description actualiza un producto por id en la tabla productos
 * 
 */
router.put('/product', async (req, res) => {
    try {
        await sequelize.query(`
        UPDATE products set price = :_price, name = :_name
        WHERE id = :_id
        `,{
            type: sequelize.QueryTypes.UPDATE,
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

router.delete('/product', async (req, res) =>{
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
router.get('/products', (req, res) => {
    sequelize.query("select * from products", 
    { type: sequelize.QueryTypes.SELECT} )
    .then( (list) => {
	    res.send(list);
    });
}); 
module.exports = router