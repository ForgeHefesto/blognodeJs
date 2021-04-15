const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

app.set('view engine','ejs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/",(req,res) =>{
    res.render('index')
})

//DatabaseError
connection.authenticate().then(() =>{
    console.log('Conexao sucesso')
}).catch((error) =>{
    console.log(error)
})

app.listen(8080,() =>{
    console.log('Servidor rodando')
})