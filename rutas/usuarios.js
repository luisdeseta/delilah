const router = require('express').Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const sequelize = require('../services/conexion');
const { Sequelize, DataTypes, Model, QueryTypes, Op } = require('sequelize');


// creacion del modelo de usuarios
const User = sequelize.define("usuarios", {
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

  //Crea el usuario Admin, la tabla esta creada desde Scrip de SQL
  router.post('/createusertable', async (req, res) => {
    try {
        //await User.sync();
        const saltos = await bcrypt.genSalt(10);
        const admin = await User.create({
          userName: "admin",
          completeName: "Administrador",
          email:"admin@admin.com.ar",
          phone:"1",
          adress:"calle 1",
          pass: await bcrypt.hash("admin123", saltos),
          role: "admin"  
        })
        res.json({Mensaje: `Usuario ${User.userName} creado con éxito`});

        
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
//
router.post('/user/login', async (req, res) =>{
  //Busco por email o nombre de usuario para el login
  const userLogin = await User.findAll({
    where:{  [Op.or]: [{email : req.body.usuario}, {userName : req.body.usuario}]
    }
  
  })
  if (userLogin == 0) return res.status(400).json({Mensaje: "Email o password incorrecto!!"})
  //Valido pass
  const userPass = await bcrypt.compare(req.body.pass, userLogin[0].pass)
  if (!userPass) return res.status(400).json({Mensaje: "Email o password incorrectO"})
  //console.log(JSON.stringify(userLogin[0], null, 2))
  //Creo el token
  const token = jwt.sign({
    //name: userLogin[0].userName,
    email: userLogin[0].email,
    id: userLogin[0].id,
    role: userLogin[0].role
  },process.env.SECRET_TOKEN)
  
  //res.json({Usuario: userLogin[0].completeName,token});
  //envio el token al header
  //TODO usar express-JWT
  res.header('token', token).json({data:{token}})
});

/**
 * @description acceso a datos personales del usuario
 * USER
 */
router.get('/user', async (req, res) =>{
  const valid = jwt.verify(req.header('token'), process.env.SECRET_TOKEN, );
  const userID = valid.id;
  const user = await User.findAll({
    where: {id: userID}
  })
  res.status(200).json({Datos_Usuario: user})
})

/**
 * @description recupera la lista de todos los usuarios
 * ADMIN
 */
router.get('/users', async (req, res) =>{
  const usuarios = await User.findAll({
    //where:{ email: req.body.email   }
   })
  res.json({usuarios});
  //console.log(users.every(user => user instanceof User)); 
  //console.log(JSON.stringify(users, null,2));
})

module.exports = {router, User}