const express  = require('express');
const bodyParser = require('body-parser');
const newsRoutes = express.Router();
const verifyToken = require('../middleware/authJWT');
const User=require('../models/users.json')
const path = require('path');
const fs = require("fs");


//const fetch = require('node-fetch');
const app = express();

app.use(newsRoutes);
newsRoutes.use(bodyParser.urlencoded({ extended: false }));
newsRoutes.use(bodyParser.json());



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
   // res.send(newsData)
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


const url = 'https://newsdata.io/api/1/news?apikey=pub_21345f24254e3a69f703045028016aceec81f&q=cryptocurrency';

// const fetchNewsData = async (url) => {
//     try {
//       const response = await Promise.all(Object.values(url).map(endpoint => fetch(endpoint)));
//       const data = await Promise.all(responses.map(response => response.json()));
//     //  console.log(data);
//       return data;
//     } catch (error) {
//       console.error('Error fetching news data:', error);
//       throw error;
//     }
//   }

//   const filterNewsData = (sourceData, preferences) => {
//     const filteredData = [];
//      // const sourceName = sourceData.source.name;
//    //  console.log(sourceData);
//       const sourceArticles = sourceData.results.filter(article => {
//         return preferences.includes(article.category);
//       });
//       console.log(sourceArticles);
//       if (sourceArticles.length > 0) {
//         filteredData.push({
//          // source: sourceName,
//           articles: sourceArticles
//         });
//       }
    
//     return filteredData;
//   }
//   newsRoutes.get('/prefNews',verifyToken,(req,res)=>{
//     if(!req.user&&req.message==null){
//         res.status(403).send({
//             message:'Invalid JWT token'
//         })
//     }
//     else if(!req.user&&req.message){
//         res.status(403).send({
//             message:req.message
//         })
//     } 
//     const finalUser = req.user;
//    // res.status(200);
//     const pref = finalUser.preferences;
//     const fetchData = fetchNewsData(url);
//     console.log(fetchData);
//     const filterData = filterNewsData(fetchData, pref);
//     console.log(filterData);
//     if(filterData){
//         res.status(200);
//         res.send(filterData);
//     }
//     else{
//         res.status(200);
//         res.send('Cannpt find new');
//     }

// })
// newsRoutes.get('/',verifyToken,(req,res)=>{
//     if(!req.user&&req.message==null){
//         res.status(403).send({
//             message:'Invalid JWT token'
//         })
//     }
//     else if(!req.user&&req.message){
//         res.status(403).send({
//             message:req.message
//         })
//     }
//     res.status(200)
//    // res.send(newsData)
// })
module.exports=newsRoutes