const router = require('express').Router();
const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize');

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

// creacion del modelo de usuarios
// falta validar  pass y longitudes
const User = sequelize.define("user", {
    userName: DataTypes.TEXT,
    completeName: DataTypes.TEXT,
    email: {type: DataTypes.STRING,
            validate:{isEmail:true,
                    }},
    phone: {type: DataTypes.INTEGER},
    adress: DataTypes.TEXT,
    pass: DataTypes.TEXT
    
  },
  {
    timestamps: false
  });

  //crea la tabla de usuarios
  router.post('/createusertable', async (req, res) => {
    try {
        await User.sync();
        res.json({Mensaje: `Tabla ${User.tableName} creada con éxito`});
        
    } catch (error) {
        res.json({error})        
    }
});

//registro de usuarios
router.post('/user', async (req, res)=>{
    //revisar usuario existen

    //crear usuario
    const usuario = await User.create({
      userName: req.body.userName,
      completeName: req.body.completeName,
      email:req.body.email,
      phone:req.body.phone,
      adress:req.body.adress,
      pass:req.body.pass
    })
    res.json({Mensaje: `Hola ${usuario.completeName}, gracias por resgistrarte :)`})
})

module.exports = router