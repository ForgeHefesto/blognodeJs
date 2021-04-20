const Sequelize = require('sequelize')

const connection = new Sequelize('blogonepiece','root','Camiza10',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection;