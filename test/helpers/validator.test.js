var User = require("../../src/models/users.json");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../../app");
const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

describe("Sign Up and SignIn Tests", () => {
  it("Succesfull Signup", (done) => {
    let userDetails = {
      email: "td@gmail.com",
      password: "$2b$08$MqvQCbor9e3LKdCC",
      preferences: "sports",
    };
    chai
      .request(server)
      .post("/register")
      .send(userDetails)
      .end((err, res) => {
        expect(res.status).equal(200);
        expect(res.body.message).equal("User Registered successfully");
        done();
        let current_users = JSON.parse(JSON.stringify(User));
        current_users.users = current_users.users.filter(
          (user) => user.email !== userDetails.email
        );
        const write_path = path.join(
          __dirname,
          "../..",
          "/src/models/users.json"
        );
        fs.writeFileSync(write_path, JSON.stringify(current_users));
      });
  });

  it("UnSuccesfull Signup due to Invalid Email", (done) => {
    let userDetails = {
      email: "tdgmailcom",
      password: "$2b$08$MqvQCbor9e3LKdCC",
      preferences: "sports",
    };
    chai
      .request(server)
      .post("/register")
      .send(userDetails)
      .end((err, res) => {
        expect(res.status).equal(400);
        expect(res.body.message).equal("Invalid Email Pattern");
        done();
      });
  });

  it("UnSuccesfull Signup due to weak Password", (done) => {
    let userDetails = {
      email: "td@gmail.com",
      password: "1234",
      preferences: "sports",
    };
    chai
      .request(server)
      .post("/register")
      .send(userDetails)
      .end((err, res) => {
        expect(res.status).equal(400);
        expect(res.body.message).equal(
          "Password should be atleast 8 characters long, has at least 1 special character, 1 digit, 1 lowercase and 1 uppercase"
        );
        done();
      });
  });

  it("Successfull Signin", (done) => {
    let userCredentials = {
      email: "dhireshg@gmail.com",
      password: "123456",
    };
    chai
      .request(server)
      .post("/signin")
      .send(userCredentials)
      .end((err, res) => {
        expect(res.status).equal(200);
        expect(res.body.message).equal("Login Successfull");
        // token = res.body.accessToken;
        done();
      });
  });

  it("UnSuccessfull Signin due to missing details", (done) => {
    let userCredentials = {
      email: "dhireshg@gmail.com",
    };
    chai
      .request(server)
      .post("/signin")
      .send(userCredentials)
      .end((err, res) => {
        expect(res.status).equal(401);
        expect(res.body.message).equal("Incomplete details");
        //  token = res.body.accessToken;
        done();
      });
  });

  it("UnSuccessfull Signin due to Wrong Password or email", (done) => {
    let userCredentials = {
      email: "dhireshg@gmail.com",
      password: "jefihfiehfd",
    };
    chai
      .request(server)
      .post("/signin")
      .send(userCredentials)
      .end((err, res) => {
        expect(res.status).equal(401);
        expect(res.body.message).equal("Invalid username or password");
        //  token = res.body.accessToken;
        done();
      });
  });
});

describe("News Aggregator Tests with SuccessFul sign in  ", () => {
  //  let token = null;
  let userCredentials = {
    email: "dhireshg@gmail.com",
  };
  let userId = "2c5a57c4-cf85-48f6-a8dd-5a73b518eb65";
  token = jwt.sign(
    {
      id: userId,
    },
    process.env.API_SECRET,
    {
      expiresIn: 86400,
    }
  );

  it("Get News According to preferences", (done) => {
    chai
      .request(server)
      .get("/news")
      .send(userCredentials)
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          expect(res.status).to.have.equal(200);
          done();
        }
      });
  });

  it("Get preferences of User", (done) => {
    // console.log(`JWT ${token}`);

    chai
      .request(server)
      .get("/news/preferences")
      .send(userCredentials)
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          expect(res.status).to.have.equal(200);
          done();
        }
      });
  });

  it("Should update tasks", (done) => {
    //  console.log(`JWT ${token}`);
    let userPrefCredentials = {
      email: "dhireshg@gmail.com",
      preferences: "technology",
    };
    chai
      .request(server)
      .put("/news/preferences")
      .send(userPrefCredentials)
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          expect(res.status).to.have.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal("Task updated");
          done();
        }
      });
  });
});

describe("News Aggregator Tests with UnSuccessFul sign in  ", () => {
  it("Should return 403 if JWT token is invalid", (done) => {
    let userCredentials = {
      email: "dhireshg@gmail.com",
    };
    chai
      .request(server)
      .get("/news")
      .send(userCredentials)
      .set("Authorization", "JWT invalid_token")
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property("message", "Invalid JWT token");
        done();
      });
  });

  it("Should return 403 if JWT token is missing", (done) => {
    let userCredentials = {
      email: "dhireshg@gmail.com",
    };
    chai
      .request(server)
      .get("/news")
      .send(userCredentials)
      .set("Authorization", "")
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property(
          "message",
          "Authorization header not found"
        );
        done();
      });
  });
});

//   var User = require("../../src/models/users.json");
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// const server = require('../../app');
// const expect = require('chai').expect;
// const fs = require('fs');
// const path=require('path')

// describe('News Aggregator Tests ', ()=>{

//     let token = null;
//     it("Succesfull Signup", (done)=>{
//         let userDetails={
//             "email": "td@gmail.com",
//             "password": "$2b$08$MqvQCbor9e3LKdCC",
//             "preferences": "sports"
//         };
//         chai.request(server).post('/register').send(userDetails).end((err,res) => {
//             expect(res.status).equal(200);
//             expect(res.body.message).equal('User Registered successfully');
//             done();
//                 let current_users = JSON.parse(JSON.stringify(User))
//                 current_users.users = current_users.users.filter(user => user.email !== userDetails.email);
//                 const write_path=path.join(__dirname,'../..','/src/models/users.json')
//                 fs.writeFileSync(write_path, JSON.stringify(current_users));
//         })
//     })

//     it("UnSuccesfull Signup due to Invalid Email", (done)=>{
//         let userDetails={
//             "email": "tdgmailcom",
//             "password": "$2b$08$MqvQCbor9e3LKdCC",
//             "preferences": "sports"
//         };
//         chai.request(server).post('/register').send(userDetails).end((err,res) => {
//             expect(res.status).equal(400);
//             expect(res.body.message).equal('Invalid Email Pattern');
//             done();

//         })
//     })

//     it("UnSuccesfull Signup due to weak Password", (done)=>{
//         let userDetails={
//             "email": "td@gmail.com",
//             "password": "1234",
//             "preferences": "sports"
//         };
//         chai.request(server).post('/register').send(userDetails).end((err,res) => {
//             expect(res.status).equal(400)
//             expect(res.body.message).equal('Password should be atleast 8 characters long, has at least 1 special character, 1 digit, 1 lowercase and 1 uppercase');
//             done();

//         })
//     })

//     it("Successfull Signin", (done)=>{
//         let userCredentials={
//             "email":"dhireshg@gmail.com",
//             "password":"123456"
//         }
//         chai.request(server).post('/signin').send(userCredentials).end((err,res) => {
//             expect(res.status).equal(200);
//             expect(res.body.message).equal('Login Successfull');
//             token = res.body.accessToken;
//             done();
//         })
//     })

//     it("UnSuccessfull Signin due to missing details", (done)=>{
//         let userCredentials={
//             "email":"dhireshg@gmail.com",
//         }
//         chai.request(server).post('/signin').send(userCredentials).end((err,res) => {
//             expect(res.status).equal(401);
//             expect(res.body.message).equal('Incomplete details');
//           //  token = res.body.accessToken;
//             done();
//         })
//     })

//     it("UnSuccessfull Signin due to Wrong Password or email", (done)=>{
//         let userCredentials={
//             "email":"dhireshg@gmail.com",
//             "password":"jefihfiehfd"
//         }
//         chai.request(server).post('/signin').send(userCredentials).end((err,res) => {
//             expect(res.status).equal(401);
//             expect(res.body.message).equal('Invalid username or password');
//           //  token = res.body.accessToken;
//             done();
//         })
//     })

//     it('Get News According to preferences',(done)=>{
//        // console.log(`JWT ${token}`);
//         let userCredentials = {
//             "email":"dhireshg@gmail.com"
//         }
//         chai.request(server).get('/news').send(userCredentials)
//         .set('Authorization',`JWT ${token}`)
//         .end((err,res)=>{
//             if(err){
//                 console.log(err);
//                 done(err);
//             }
//             else{
//             expect(res.status).to.have.equal(200);
//             done();}
//         })
//     })

//     it('Should return 403 if JWT token is invalid', (done) => {
//         let userCredentials = {
//             "email":"dhireshg@gmail.com"
//         }
//         chai.request(server)
//           .get('/news').send(userCredentials)
//           .set('Authorization', 'JWT invalid_token')
//           .end((err, res) => {
//             expect(res).to.have.status(403);
//             expect(res.body).to.have.property('message', 'Invalid JWT token');
//             done();
//           });
//       });

//       it('Should return 403 if JWT token is missing', (done) => {
//         let userCredentials = {
//             "email":"dhireshg@gmail.com"
//         }
//         chai.request(server)
//           .get('/news').send(userCredentials)
//           .set('Authorization', '')
//           .end((err, res) => {
//             expect(res).to.have.status(403);
//             expect(res.body).to.have.property('message', 'Authorization header not found');
//             done();
//           });
//       });

//     it('Get preferences of User',(done)=>{
//        // console.log(`JWT ${token}`);
//         let userCredentials = {
//             "email":"dhireshg@gmail.com"
//         }
//         chai.request(server).get('/news/preferences').send(userCredentials)
//         .set('Authorization',`JWT ${token}`)
//         .end((err,res)=>{
//             if(err){
//                 console.log(err);
//                 done(err);
//             }
//             else{
//             expect(res.status).to.have.equal(200);
//             done();}
//         })
//     })

//     it('Should update tasks',(done)=>{
//       //  console.log(`JWT ${token}`);
//         let userCredentials = {
//             "email":"dhireshg@gmail.com",
//             "preferences":"technology"
//         }
//         chai.request(server).put('/news/preferences').send(userCredentials)
//         .set('Authorization',`JWT ${token}`)
//         .end((err,res)=>{
//             if(err){
//                 console.log(err);
//                 done(err);
//             }
//             else{
//             expect(res.status).to.have.equal(200)
//             expect(res.body.success).to.equal(true)
//             expect(res.body.message).to.equal('Task updated')
//             done();}
//         })
//     })

// })
