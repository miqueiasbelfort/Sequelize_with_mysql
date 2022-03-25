const { DataTypes } = require('sequelize') //Propriedade que da acesso a todos os dados do banco

//Chamar o db para fazer a conecção com a classe
const db = require('../db/comn') 


// Classe 
const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    occupation: {
        type: DataTypes.STRING,
        require: true
    },
    newsletter: {
        type: DataTypes.BOOLEAN
    }
})

module.exports = User