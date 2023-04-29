const jwt=require('jsonwebtoken')
const User= require('../models/users.json')

const verifyToken=(req,res,next) => {
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0]=='JWT'){
        jwt.verify(req.headers.authorization.split(' ')[1],process.env.API_SECRET,function(err,decode){
            const {email,password}=req.body;
            let current_users=JSON.parse(JSON.stringify(User))
            const user= current_users.users.find(val=>val.email==email);
            if(err){
                req.user=undefined
                next()
            }
            if(user.id===decode.id){
                req.user = user;
               // res.send(user);
                next();

            }else{
                res.status(500);
            }
        });

    }
    else{
        req.user=undefined
        req.message='Authorization header not found'
        next()
    }
}

module.exports=verifyToken