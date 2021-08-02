const router = require('express').Router();
const { Sequelize, DataTypes, Model, QueryTypes, Op} = require('sequelize');
const bcrypt = require('bcrypt');
const validator = require('validator');
require('dotenv').config()
const jwt = require('jsonwebtoken');

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
const User = sequelize.define("user", {
    userName: {
      type: DataTypes.TEXT,
      allowNull: false,  
      validate:{ 
        notNull:{msg: "el userName no puede ser null"}
              }},
    completeName: DataTypes.TEXT,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
            validate:{
              isEmail:{msg: "Revise el formato del email"},
              notNull:{msg: "el email no puede ser null"}
                    }},
    phone: {type: DataTypes.INTEGER},
    adress: DataTypes.TEXT,
    pass: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate:{
          notNull: {msg: "pass no puede ser null"}
      }
    },
    role:{
      type: DataTypes.TEXT,
      allowNull: false,
    }
    
  },
  {
    timestamps: false,
    
  });

  //crea la tabla de usuarios
  //TODO Crear un usuario ADMIN 
  router.post('/createusertable', async (req, res) => {
    try {
        await User.sync();
        const saltos = await bcrypt.genSalt(10);
        const admin = User.create({
          userName: "admin",
          completeName: "Administrador",
          email:"admin@admin.com.ar",
          phone:"1",
          adress:"calle 1",
          pass: await bcrypt.hash("admin123", saltos),
          role: "admin"  
        })
        res.json({Mensaje: `Tabla ${User.tableName} creada con éxito`});

        
    } catch (error) {
        res.json({error})        
    }
});

//registro de usuarios
router.post('/user', async (req, res)=>{
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
          pass:pass,
          role: "user"


        })
        res.status(200).json({Mensaje: `Usuario registrado con exito`})
        

      } catch (error) {
        res.status(400).json({Mensaje: "no se pudo crear el usuario", Error: error})
        
      }
      
    } else {
      if (verifyEmail.length) {
        res.status(400).json({Mensaje: `Este email ya existe`})
        
      }

    } res.json({error: "error"})

})

//Login de Usuario
router.post('/user/login', async (req, res) =>{
  //Busco por email
  const userLogin = await User.findAll({
    where:{  email:{[Op.eq]: req.body.email}  }
  })
  if (userLogin == 0) return res.status(400).json({Mensaje: "Email o password incorrecto!!"})
  //Valido pass
  const userPass = await bcrypt.compare(req.body.pass, userLogin[0].pass)
  if (!userPass) return res.status(400).json({Mensaje: "Email o password incorrectO"})
  console.log(JSON.stringify(userLogin[0], null, 2))
  //Creo el token
  const token = jwt.sign({
    //name: userLogin[0].userName,
    email: userLogin[0].email,
    //id: userLogin[0].id,
    role: userLogin[0].role
  },process.env.SECRET_TOKEN)
  
  res.json({Usuario: userLogin[0].completeName,
  token});
  //envio el token al header
  res.header('token', token).json({data:{token}})
});


router.get('/users', async (req, res) =>{
  const users = await User.findAll({
    //where:{ email: req.body.email   }
   })
  res.json({users});
  //console.log(users.every(user => user instanceof User)); 
  console.log(JSON.stringify(users, null,2));
})

module.exports = router