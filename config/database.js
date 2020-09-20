const mongoose = require('mongoose')

const uri = `mongodb+srv://yassine:yassine@cluster0.wz3mh.gcp.mongodb.net/BlogDB?retryWrites=true&w=majority`
mongoose.connect(uri,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
},(err)=>{
    if(!err){
       return console.log('Database connected!')
    }
    console.log(err)
})