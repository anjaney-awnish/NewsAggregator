const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const User=require('../models/users.json')
const fs=require('fs-extra')
const path= require('path')
const { v4: uuidv4 } = require('uuid');
const { randomUUID } = require('crypto')
const validator=require('../helpers/validator.js')

var signup=(req,res)=>{

    const userData=req.body

    userData.id=uuidv4()
   

   // console.log(userData)

    const write_path=path.join(__dirname,'..','models/users.json')

    if(validator.validateNewUserData(userData,User).status){
        let current_users=JSON.parse(JSON.stringify(User))
        userData.password=bcrypt.hashSync(req.body.password,8)
        current_users.users.push(userData)
        fs.writeFileSync(write_path,JSON.stringify(current_users))
        res.status(200).json(validator.validateNewUserData(userData,User))
    }

    else{
        res.status(400)
        res.json(validator.validateNewUserData(userData,User))
    }

    //console.log(userData.id)

}

var signin=(req,res)=>{
    const {email,password}=req.body;

    if(req.body.email!=null && req.body.password!=null){
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
           // console.log(result)
            return res.status(401).send({
                message:'Invalid username or password'
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

else{
    res.status(401).send({
        'message':'Incomplete details'
    })
}
}

module.exports={
    signin,signup
};