const express = require("express");
const serverless = require("serverless-http");
require("dotenv").config(); 


const app = express();
const router = express.Router();

const axios = require('axios');


router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

router.get("/test-get-api", async (req, res) => {
//   let data = '{\n    "collection":"testing-collection",\n    "database":"test-1",\n    "dataSource":"wmpsc-mongo",\n    "filter": {\n      "name": "qu1"\n    }\n  }';
// var result = "abc";
// let config = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-kytrg/endpoint/data/v1/action/findOne',
//   headers: { 
//     'apiKey': 'uKiz0x8w9yrAm3WoG9wMrLm7DvN2Rlk7jV4dv93i1cmEgL414tN7DAdqSpSvgXvH', 
//     'Content-Type': 'application/ejson', 
//     'Accept': 'application/json'
//   },
//   data : data
// };

// fetch(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
//   result = JSON.stringify(response.data)
// })
// .catch((error) => {
//   console.log(error);
// });

var result1;

const myHeaders = new Headers();
myHeaders.append("apiKey", "uKiz0x8w9yrAm3WoG9wMrLm7DvN2Rlk7jV4dv93i1cmEgL414tN7DAdqSpSvgXvH");
myHeaders.append("Content-Type", "application/ejson");
myHeaders.append("Accept", "application/json");

const raw = "{\n    \"collection\":\"testing-collection\",\n    \"database\":\"test-1\",\n    \"dataSource\":\"wmpsc-mongo\",\n    \"filter\": {\n      \"name\": \"qu1\"\n    }\n  }";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

await fetch("https://ap-south-1.aws.data.mongodb-api.com/app/data-kytrg/endpoint/data/v1/action/findOne", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    res.json({
      hello: "hi!",
      results: result
    });
  })
  .catch((error) => console.error(error));


  
});





app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
