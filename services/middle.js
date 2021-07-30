const jwt = require('jsonwebtoken')

const validToken = (req, res, next) =>{
    const token = req.header('token');
    if(!token) return res.status(401).json({Mensaje: "Acceso Denegado"});
    try {
        const valid = jwt.verify(token, process.env.SECRET_TOKEN);
        next()
    } catch (error) {
        res.status(401).json({mensaje: "error token"})
        
    }
};

module.exports = validToken;