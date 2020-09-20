require('dotenv').config()
const express = require('express')
const cors = require('cors')
require('./config/database')
const app = express()


app.use(express.json())
app.use(cors())

// app.use( (req,res,next)=> {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization')

//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
//         return res.status(200).json({})
//     }
// })

//routes
const articlesRouter = require('./routes/articles.router')
app.use('/api/articles',articlesRouter)


const usersRouetr = require('./routes/users.router')
app.use('/api/users', usersRouetr)

app.get('/',(req,res)=>{
    res.redirect('/api/articles')
})


const PORT = 5000
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))