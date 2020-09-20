const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})

const User  = mongoose.model('users',userSchema)

module.exports = User