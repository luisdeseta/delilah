const { Sequelize, DataTypes, Model, QueryTypes, Op } = require('sequelize');
//const sequelize = require('../services/conexion');
const bcrypt = require('bcrypt');
const {User} = require('./usuarios');



//Creación de usuario ADMIN
async function userAdmin  () {
    
    try {
      const saltos = await bcrypt.genSalt(10);
      const admin = await User.create({
        userName: "admin",
        completeName: "admin",
        email:"admin@acamica.com.ar",
        phone:"1",
        adress:"calle 1",
        pass: await bcrypt.hash("admin123", saltos),
        role: "admin"  
      })
      console.log({Mensaje: `Usuario ${admin.userName} creado con éxito`});
      console.log(admin)
    
      
    } catch (error) {
        console.log(error + " ==> error al Admin user");        
    }
}

//Creacion de usuarios de prueba
async function userExample () {
try {
    User.bulkCreate([
        {userName: "Moises",
        completeName: "Moises",
        email:"moises@acamica.com",
        phone:"123",
        adress:"calle 123",
        pass: await bcrypt.hash("m123", 10),
        role: "user" },
        {userName: "Cristian",
        completeName: "Cristian",
        email:"cristian@acamica.com",
        phone:"123",
        adress:"calle 123",
        pass: await bcrypt.hash("c123", 10),
        role: "user" },
        {userName: "Daniel",
        completeName: "Daniel",
        email:"daniel@acamica.com",
        phone:"123",
        adress:"calle 123",
        pass: await bcrypt.hash("d123", 10),
        role: "user" }
    ])
    .then(()=> {
        console.log("hola")
      return User.findAll()
        
    })
    .then( usuarios => {
        console.log(usuarios)
    })
    


} catch (error) {
    console.log(error + "error al crear usuarios ejemplo")
    
    }
}

userExample();
//userAdmin();
