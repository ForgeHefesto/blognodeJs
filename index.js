const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

const categoriesController = require('./Categories/CategoriesController')
const articlesController = require('./Articles/ArticlesController')
const userController = require('./User/UserController')


const Article = require('./Articles/Article')
const Category = require('./Categories/Category')
const Users = require('./User/User')

app.set('view engine','ejs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/",(req,res) =>{
    Article.findAll({
        order:[['title','ASC']],
        limit: 4
    }).then((articles) =>{
        Category.findAll().then((categories) =>{
            res.render('index',{articles: articles,categories: categories})
        })
    })
})

//DatabaseError
connection.authenticate().then(() =>{
    console.log('Conexao sucesso')
}).catch((error) =>{
    console.log(error)
})

app.use('/',categoriesController)
app.use('/',articlesController)
app.use('/',userController)

app.get('/:slug',(req,res) =>{
    var slug = req.params.slug
    Article.findOne({
        where:{
            slug: slug
        }
    }).then((article) =>{
        if(article != undefined){
            Category.findAll().then((categories) =>{
                res.render('article',{article: article,categories: categories})
            })
        }else{
            res.redirect('/')
        }

    }).catch(err =>{
        res.redirect('/')
    })
})

app.get("/category/:slug",(req,res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {slug: slug},
        include: [{model: Article}]
    }).then((category) =>{
        if(category != undefined){
            Category.findAll().then((categories) =>{
                res.render('index',{articles : category.articles,categories:categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch(err =>{
        res.redirect('/')
    })

})


app.listen(8080,() =>{
    console.log('Servidor rodando')
})