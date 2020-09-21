const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Article = require('../models/article.model')
require('../config/database')


router.get("/", (req, res) => {
    Article.find((err, articles) => {
        if (!err) {
            res.status(201).json(articles)
        } else {
            res.status(401).json({ err: err.message })
        }
    })
})

//post article
router.post('/create',auth, async (req, res) => {
    const { title, description } = req.body
    if (!title || !description) {
        return res.status(401).json({ msg: "All Fields required!" })
    }
    const newArticle = await new Article({
        title,
        description,
        created_at: Date.now()
    })

    const savedArticle = await newArticle.save()
    res.status(201).json(savedArticle)
})

//edit article
router.put('/edit/:id', async (req, res) => {
    const { title, description } = req.body
    const id = ({ _id: req.params.id })
    if (!title || !description) {
        return res.status(401).json({ msg: "All Fields are required!" })
    }

    const editArticle = {
        title,
        description,
        created_at: Date.now()
    }

     Article.updateOne(id, editArticle, (err) => {
       
        if(!err){
           res.status(201).json({ msg: "Article was updated successfully" })
        }else{
            return res.status(401).json({ err: err.message })
        }
    })

})

//delete article
router.delete('/delete/:id',auth, (req,res)=>{
    const id = ({_id:req.params.id})
    Article.findByIdAndDelete(id,(err)=>{
        if(!err){
            res.status(201).json({ msg: "Article was deleted successfully" })
         }else{
             return res.status(401).json({ err: err.message })
         }
    })

})

//get one article
router.get("/:id", async(req,res)=>{
    const id = {_id: req.params.id}
    await Article.findById(id,(err,article)=>{
        if (!err) {
            res.status(201).json(article)
        } else {
            res.status(401).json({ err: err.message })
        }
    })
})





module.exports = router
