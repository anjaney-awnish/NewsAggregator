const express  = require('express');
const bodyParser = require('body-parser');
const newsRoutes = express.Router();
const verifyToken = require('../middleware/authJWT');
const path = require('path');
const fs = require("fs");
const User=require("../models/users.json")
const newsPromise=require('../controllers/newsController')


const app = express();

app.use(newsRoutes);
newsRoutes.use(bodyParser.urlencoded({ extended: false }));
newsRoutes.use(bodyParser.json());

const url = 'https://newsapi.org/v2/top-headlines/sources?apiKey=2e55551034f048bfb7a116856154b60a';

newsRoutes.get('/',verifyToken,(req,res)=>{
   // console.log('hi')
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

    const searchParams=new URLSearchParams({category: req.user.preferences});
    console.log(`${url}&${searchParams}`)

    newsPromise(`${url}&${searchParams}`).then(resp=>{
        res.setHeader('Content-Type','application/json');
        res.status(200).json(resp);
        console.log(resp)
    }).catch(err=>{
        
        res.setHeader('Content-Type','application/json');
        console.log(resp)
        res.status(500).json(resp);
    })
      

    // console.log(result)

    // res.status(200).send(result)
    
})


newsRoutes.get('/preferences',verifyToken,(req,res)=>{
    if(!req.user && req.message==null){
        res.status(403).send({
            message:'Invalid JWT token'
        })
    }
    else if(!req.user&&req.message){
        res.status(403).send({
            message:req.message
        })
    }
    const finalUser = req.user;
   // res.status(200);
    console.log(finalUser.preferences);
    res.status(200).send(finalUser.preferences);
})


newsRoutes.put('/preferences',verifyToken,(req,res)=>{
    if(!req.user && req.message==null){
        res.status(403).send({
            message:'Invalid JWT token'
        })
    }
    else if(!req.user&&req.message){
        res.status(403).send({
            message:req.message
        })
    }
    const ourUser = req.user;
    ourUser.preferences = req.body.preferences;
    let write_path = path.join(__dirname,'..','models/users.json');
    let current_users = JSON.parse(JSON.stringify(User));
    let updateIndex = current_users.users.findIndex(val => val.email==ourUser.email);
    if(updateIndex!=-1){
        current_users.users[updateIndex] = ourUser
        fs.writeFileSync(write_path,JSON.stringify(current_users), { encoding: 'utf8' , flag: 'w'});
        res.status(200).json({success:true,message:'Task updates'});
    }
    else{
        res.status(404).json({success:false,message:'Task not found'});
    }
    
}
)

module.exports=newsRoutes