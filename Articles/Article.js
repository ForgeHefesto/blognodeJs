const Sequelize = require('sequelize')
const connection = require('../database/database')
const Category = require('../Categories/Category')

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article)
Article.belongsTo(Category)

// Article.sync({force:true}) criaçao da tabela

module.exports = Article