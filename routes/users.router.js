const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')
const User = require('../models/user.model')
require('../config/database')



//register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body

        //validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are Required!" })
        }

        if (name.length < 5) {
            return res.status(400).json({ msg: "Name must be at least 5 characters" })
        }

        if (name.length > 20) {
            return res.status(400).json({ msg: "Name must be less than 20 characters" })
        }

        if (password.length < 5) {
            return res.status(400).json({ msg: "Password must be at least 5 characters" })
        }

        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            return res.status(400).json({ msg: "An account with this email already exists!" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            created_at: Date.now()
        })

        const savedUser = await newUser.save()
        res.json(savedUser)
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }

})


//login user
router.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body
        
        //validation
        if(!email || !password){
            return res.status(400).json({ msg: "All fields are Required!" })
        }

        const user = await User.findOne({email:email})

        if(!user){
            return res.status(400).json({ msg: "No Account with this credentials" })
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({ msg: "Wrong Credentials" })
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
        res.json({
            token,
            user:{
                id:user._id,
                name:user.name,
                email: user.email
            }
        })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
})

//validate token
router.post('/tokenIsValid', async(req,res)=>{
      try{
         const token = req.header('auth-token')
         if(!token){
             return res.json(false)
         }

         const verified = jwt.verify(token, process.env.JWT_SECRET)
         if(!verified){
             return res.json(false)
         }

         const user = await User.findById(verified.id)
         if(!user){
             return res.json(false)
         }

         return res.json(true)

      }catch(err){
        return res.status(500).json({ err: err.message })
      }
})

//get user from db
router.get('/profile', auth, async(req,res)=>{
     const user = await User.findById(req.user)
     res.json({
         id:user._id,
         name:user.name,
         email:user.email
     })
})




module.exports = router