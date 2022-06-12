const express = require('express')
const mongoose = require('mongoose');
const app= express();
const cors = require('cors');
const path = require('path')
const bodyParser = require('body-parser');
const PORT= process.env.PORT || 5000;

mongoose.connect('mongodb+srv://yogesh:yogesh@cluster0.p0b6ii7.mongodb.net/?retryWrites=true&w=majority',function(){
    console.log("mongoose connected")
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
///useroutes
app.use('/api/v1',require('./routes/auth'))
//order route
app.use('/api/v1',require('./routes/order'))


//middleware
const middleware =(req,res,next) =>{
    console.log("middleware here")
    
}
middleware();





//routes
app.get('/',(req,res)=>{
    res.send("homepage")
})





app.listen(PORT, ()=>{
    console.log(`server started on Port ${PORT}`)
})
