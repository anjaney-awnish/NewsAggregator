const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const User=require('../models/users.json')
const fs=require('fs-extra')
const path= require('path')
const { v4: uuidv4 } = require('uuid');
const { randomUUID } = require('crypto')

var signup=(req,res)=>{
    const userData={
        id:uuidv4(),
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,8),
        preferences:req.body.preferences
    }

    console.log(userData.id)

    const write_path=path.join(__dirname,'..','models/users.json')

    let current_users=JSON.parse(JSON.stringify(User))

    current_users.users.push(userData)

    fs.writeFileSync(write_path,JSON.stringify(current_users))

}

var signin=(req,res)=>{
    const {email,password}=req.body;
    const read_path=path.join(__dirname,'..','models/users.json')
    let current_users=JSON.parse(JSON.stringify(User))
    const user= current_users.users.find(val=>val.email==email);
    //console.log(user)
    if(!user){
        return res.status(401).send({
            message:'Invalid username or password'
        })
    }
    
    bcrypt.compare(password,user.password,(err,result)=>{
        
        if(err||!result){
            console.log(result)
            return res.status(401).send({
                message:'Invalid user and password yha'
            })
        }
        const payload= user.email
        
        //console.log(user)
        var token=jwt.sign({
            id:user.id
            },process.env.API_SECRET,{
                expiresIn:86400
        })

         

        res.status(200).send({
            user:{
                id:user.id,
                email:user.email
            },
            message:'Login Successfull',
            accessToken:token
        })
    })
}

module.exports={
    signin,signup
};