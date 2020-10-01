const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type: String,
        required: true
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
})

const Article = mongoose.model('articles',articleSchema)

module.exports = Article