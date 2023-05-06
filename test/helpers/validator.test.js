var User = require("../../src/models/users.json");
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../app');
const expect = require('chai').expect;
const fs = require('fs');
const path=require('path')

describe('Verification of Regitser', ()=>{
    it("Succesfull Signup", (done)=>{
        let userDetails={
            "email": "td@gmail.com",
            "password": "$2b$08$MqvQCbor9e3LKdCC",
            "preferences": "sports"
        };



        
        chai.request(server).post('/register').send(userDetails).end((err,res) => {
            expect(res.status).equal(200);
            expect(res.body.message).equal('User Registered successfully');
           
            done();

            
                let current_users = JSON.parse(JSON.stringify(User))
                console.log(current_users.users)
                current_users.users = current_users.users.filter(user => user.email !== userDetails.email);
                console.log(current_users.users)
                const write_path=path.join(__dirname,'../..','/src/models/users.json')
                fs.writeFileSync(write_path, JSON.stringify(current_users));
                
            
        
        })

        
        

    })

    
})

