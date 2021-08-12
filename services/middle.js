const jwt = require('jsonwebtoken')
require('dotenv').config()

const validToken = (req, res, next) =>{
    const token = req.header('token');
    //req.token = isToken;
    if(!token) return res.status(401).json({Mensaje: "Acceso Denegado"});
    try {
        const valid = jwt.verify(token, process.env.SECRET_TOKEN, );
        //console.log(valid);
        req.tk = valid
        next()
    } catch (error) {
        res.status(401).json({mensaje: "Token invalido"})
        
    }
};

const validUser = (req, res, next) => {
    const isAdmin = req.tk;
    console.log(isAdmin)
    if(!isAdmin) return res.status(401).json({mensaje: "Acceso Denegado__"})
    try {
        if (isAdmin.role === "admin") 
        //return res.status(200).json({Mensaje: "Is Admin!"});
        next();
        else{res.status(401).json({Mensaje: "Is not Admin!"}) }
    } catch (error) {
        console.error(error);
    }
    
}

module.exports = {validToken, validUser};