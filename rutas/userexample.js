const { Sequelize, DataTypes, Model, QueryTypes, Op } = require('sequelize');
const sequelize = require('../services/conexion');
const bcrypt = require('bcrypt');
const {User} = require('./usuarios');
require('dotenv').config()
const adminPas = process.env.PASS_ADMIN || "admin123";

 const mysql = require('mysql2');
const con = mysql.createConnection({
    host: process.env.HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "luchoacamica",
    database: process.env.DB_NAME || "delilah"

})
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    const dale = 
        sequelize.query(`
        INSERT into usuarios ( userName,completeName, email, phone,
            adress, pass, role)
            values ( :userName,:completeName, :email, :phone,
                :adress, :pass, :role, )
        `, {
            type: QueryTypes.INSERT,
            replacements:{
                userName: "user",
                completeName: "usuario",
                email: "name@ejemplo.com",
                phone: "123",
                adress: "alberdi 123",
                pass: "123",
                role: "user",
            }
        })
        
    
    con.query(dale, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });

  }); 



//Creación de usuario ADMIN
async function userAdmin  () {
    
    try {
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
      console.log({Mensaje: `Usuario ${admin.userName} creado con éxito`});
      console.log(admin)
    
      
    } catch (error) {
        console.log(error + " ==> error al crear Admin user");        
    }
}

//Creacion de usuarios de prueba
async function userExample () {
try {
    await User.bulkCreate([
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

//userExample();
//userAdmin();