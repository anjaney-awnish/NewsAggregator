const express  = require('express');
const bodyParser = require('body-parser');
const newsRoutes = express.Router();
const verifyToken = require('../middleware/authJWT');
const path = require('path');
const fs = require("fs");


const app = express();

app.use(newsRoutes);
newsRoutes.use(bodyParser.urlencoded({ extended: false }));
newsRoutes.use(bodyParser.json());

let url='https://newsapi.org/v2'

newsRoutes.get('/',verifyToken,(req,res)=>{
    if(!req.user&&req.message==null){
        res.status(403).send({
            message:'Invalid JWT token'
        })
    }
    else if(!req.user&&req.message){
        res.status(403).send({
            message:req.message
        })
    }
    res.status(200)
    res.send(newsData)
})

module.exports=newsRoutes