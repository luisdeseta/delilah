const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
const bodyparser = require('body-parser');
require('dotenv').config()
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puesrto ${PORT}, YEAH!!!`);
});