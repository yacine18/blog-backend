const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Article = require('../models/article.model')
require('../config/database')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads')
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024*1024*5
    }
})


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
router.post('/create', upload.single('image'), async (req, res) => {
    const { title, description } = req.body
    const {path} = req.file 
    if (!title || !description || !path) {
        return res.status(401).json({ msg: "All Fields required!" })
    }
    const newArticle = await new Article({
        title,
        description,
        image: path,
        created_at: Date.now()
    })

    const savedArticle = await newArticle.save()
    res.status(201).json(savedArticle)
})

//edit article
router.put('/edit/:id', upload.single('image'), async (req, res) => {
    const { title, description } = req.body
    const { path } = req.file
    const id = ({ _id: req.params.id })
    if (!title || !description || !path) {
        return res.status(401).json({ msg: "All Fields are required!" })
    }

    const editArticle = {
        title,
        description,
        image: path,
        created_at: Date.now()
    }

    await Article.updateOne(id, editArticle, (err) => {
       
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
