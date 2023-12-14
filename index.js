//------------------------------REQUIRE------------------------
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRouter = require('./userRouter.js');
require('dotenv').config();


//-------------MongoDB Connection and app listening------------
const app = express();
const port = process.env.port || 8080;
mongoose.connect("mongodb://127.0.0.1:27017/UserDB")
.then(() => {
    console.log("DB connected")
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
})
.catch((error) => {
    console.log("DB couldn't connect, error: ", error)
})

//-----------------------Configuartions-----------------------
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
//-----------------------Middlewares-------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


//------------------------Routes---------------------------
app.use('/', userRouter);

//--------------Not Found and Error middlewares-------------
app.use((request, response)=>{
    response.status(404).json({data: "Not found"});
});

app.use((error, request, response, next)=>{
    let status = error.status || 500;
    const { referer } = request.headers;
    response.cookie('errors', Object.values(error));
    if(referer){
        response.redirect(request.headers.referer)
    }
    else {
        response.status(status).json({Error: error+"xoxo"});
        
    }
})