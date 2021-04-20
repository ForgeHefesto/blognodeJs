const express = require('express')
const router = express.Router()
const Category = require('../Categories/Category')
const Articles = require('./Article')
const slugify = require('slugify')
const Article = require('./Article')

router.get('/admin/articles',(req,res) =>{
    Articles.findAll({
        include:[{model: Category}]
    }).then((articles) =>{
        res.render('admin/articles/index',{articles:articles})
    })
})

router.get('/admin/articles/new',(req,res) =>{
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories:categories})
    })
})
router.get('/admin/articles/edit/:id',(req,res) =>{
    var id = req.params.id
    Articles.findByPk(id).then(article => {
        Category.findAll().then((categories) =>{
            res.render("admin/articles/edit",{article:article,categories: categories})
        })
    })
})
router.post("/articles/save",(req,res) =>{
    var title = req.body.title
    var describe = req.body.describe
    var category = req.body.category

    Articles.create({
        title: title,
        slug: slugify(title),
        body: describe,
        categoryId: category
    }).then(() =>{
        res.redirect('/admin/articles')
    })
})
router.post('/articles/update',(req,res) =>{
    var id = req.body.id
    var title = req.body.title
    var describe = req.body.describe
    var category = req.body.category
    Article.update({title:title,body:describe,categoryId: category,slug: slugify(title)},{
        where:{
            id:id
        }
    }).then(() =>{
        res.redirect('/admin/articles')
    }).catch(err =>{
        res.redirect('/admin/articles')
    })
})


router.post('/articles/delete',(req,res) => {
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            Articles.destroy({
                where: {
                    id: id
                }
            }).then(() =>{
                res.redirect("/admin/articles")
            })
        }else{
            res.redirect("/admin/articles")
        }
    }else{
        res.redirect("/admin/articles")

    }
})

router.get("/articles/page/:num",(req,res) =>{
    var page = req.params.num
    var offset = 0

    if(isNaN(page) || page <= 1){
        offset = 0
    }else{
        offset = (parseInt(page) -1) * 4;    
    }
    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id','DESC']]
    }).then((articles) =>{
        var next;
        if(offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles : articles
        }
        Category.findAll().then(categories => {

            res.render("admin/articles/page",{result: result,categories: categories})
        })

    })
})


module.exports = router