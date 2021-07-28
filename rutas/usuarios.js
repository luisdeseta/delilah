const router = require('express').Router();
const { Sequelize, DataTypes, Model, QueryTypes, Op} = require('sequelize');
const bcrypt = require('bcrypt');

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
    //validacion de formato?

    //revisar usuario existen
    const verifyEmail = await User.findAll({
      where:{ email: req.body.email }
    })
    console.log("verifyEmail", JSON.stringify(verifyEmail, null,2))


    if (verifyEmail.length == 0) {
      try {
        //Hash de password
        const saltos = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.body.pass, saltos);
        //crear usuario
        const usuario = await User.create({
          userName: req.body.userName,
          completeName: req.body.completeName,
          email:req.body.email,
          phone:req.body.phone,
          adress:req.body.adress,
          pass:pass
        })
        res.json({Mensaje: `Hola ${usuario.completeName}, gracias por resgistrarte :)`})
        

      } catch (error) {
        res.json({Mensaje: "no se pudo crear el usuario"})
        
      }
      
    } else {
      if (verifyEmail.length) {
        res.status(400).json({Mensaje: `Este email ya existe`})
        
      }

    } res.json({erro: "error"})

})

router.get('/user', async (req, res) =>{
  const users = await User.findAll({
    where:{ email: req.body.email   }
   })
  res.json({Mensaje: `Hola ${users[0].email}`});
  //console.log(users.every(user => user instanceof User)); 
  console.log("All users:", JSON.stringify(users, null,2));
})

module.exports = router