const express  = require('express');
const bodyParser = require('body-parser');
//const cors = require('cors');
const routes = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const path= require('path')
const news = require('./src/routes/news');
const {signin,signup}=require('./src/controllers/authController')

require("dotenv").config();

const app = express();
//app.use(cors());
app.use(routes);
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const PORT = 3000;


routes.get('/', (req, res)=>{
  res.status(200).send("Welcome to the News App");
});

routes.post('/register',signup)
routes.post('/signin',signin)

routes.use('/news',news)

app.listen(process.env.PORT || PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running and App is listening on port 3000 ");
    else
        console.log("Error occurred, server can't start", error);
    }
  );
module.exports= app;