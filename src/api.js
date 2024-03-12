const express = require("express");
const serverless = require("serverless-http");
require("dotenv").config(); 
const cors = require('cors');

const corsOptions = {
  origin: '*',
  credentials: false,
  optionSuccessStatus: 200
 };



const NodeRSA = require('node-rsa');

const key = new NodeRSA({b: 512});


const publicKey = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIYUA0D/vSqr9fJc59UlNqCMK+0jgHQH8m1AcCsYhtPY2j8r/tn0J+0WLAoWx5HvHHJQQ54pb6GMdU9tB/VGW2kCAwEAAQ==";
const privateKey = "MIIBPAIBAAJBAIYUA0D/vSqr9fJc59UlNqCMK+0jgHQH8m1AcCsYhtPY2j8r/tn0J+0WLAoWx5HvHHJQQ54pb6GMdU9tB/VGW2kCAwEAAQJAOmoztLj3KMU85XgWxWVuNGp9pNan22Wu+GxvskcATwFvHI/VjQT8bK94j3vAcVD0J3PzB6VqXpO+wtPazuss0QIhAPPTEsZG3bHeXeuNVAZqIzWE1e+wcmN5G+r5iwq2aRz1AiEAjMX/uKbu5CRvkGijhLUhKZWoNdxoNhK0nVHjMaTE/CUCIQCOsFqPYI+C9SA/plCjBGAghOFySO9YWVrGM010cnWnNQIhAIWaeSvPyxRdfECq/t45ZeLotX+A0qrXL/HLQPvhrE69AiEAqcl9wy3haul/uJkjk2hW7Ie+TY8rHdCK/C7op2nbqzo="


// PUBLIC:
// -----BEGIN PUBLIC KEY-----
// MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJZlrud2/wq8Nq5gnNO37TvknsTtz+ij
// ZlqqgkenBN+XAvmXKhNUC9DRlN+ReZT/iGiuB9KR0MvSgiIqNpeIAJUCAwEAAQ==
// -----END PUBLIC KEY-----

// PRIVATE:
// -----BEGIN RSA PRIVATE KEY-----
// MIIBOwIBAAJBAJZlrud2/wq8Nq5gnNO37TvknsTtz+ijZlqqgkenBN+XAvmXKhNU
// C9DRlN+ReZT/iGiuB9KR0MvSgiIqNpeIAJUCAwEAAQJAVuH/HLBdvfHlFO+zKYwD
// fKoiHlnT1e0vYAlIoeQWqKNL9e2a6KFi2m+Ir+FtVPl1M88t6Smz6tKeF/HgpHJb
// gQIhAN9HPykach3ikE76MXeiojTQJJgn8v36dDoZbxTZ3bqNAiEArHAmLXMNSg3U
// aiuFTBfp+70TJeFCC4E85jAOuuthoCkCIADrfDkhIMM6wblxkm6Zvu1UxjHSSE//
// jicHH8wIMb+pAiEAhb/jTONtjmAVv1gMZ04xNgqc3IfRI31V0DG8ay2BpqkCIQDZ
// TEciwq/KWOZIGHE2rjn2QKaFQpZ0F+npZ5QbNXxiwA==
// -----END RSA PRIVATE KEY-----

const app = express();
const router = express.Router();

app.use(cors(corsOptions));

const axios = require('axios');

router.get("/callWebsite/:id", (req, res) => {
  // const expires = body.exp.toUTCString();
  console.log(req.params['id']);
  res.cookie('id_token', req.params['id']);
  res.redirect(302, 'https://wmpscpresscreening.netlify.app/');
})

router.post("/postResult", (req,res) => {
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "2dadff71a3=c2ab5ebf8f97e7d80d5e35edddd48ba6; _zcsr_tmp=1ea94d3f-b1a4-4609-9606-9373df9aa39a; zipccn=1ea94d3f-b1a4-4609-9606-9373df9aa39a");

let data = req.body;
const raw = JSON.stringify({
  "emailId": data.emailId,
  "result": data.result,
  "resultId": data.resultId
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://flow.zoho.in/60024604063/flow/webhook/incoming?zapikey=1001.50ffc92fb74215b43a19e72ba74870e5.5da8a2d05134583f90b0a4e873a7b550&isdebug=false", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
})

router.post("/addEncryption", async (req, res) => {

var firstName = req.query.firstName;
var lastName = req.query.lastName;
var emailId = req.query.emailId;
var jobRole = req.query.jobRole;
var date = new Date();

var data =  {
  firstName: firstName,
  lastName: lastName,
  emailId: emailId,
  jobRole: jobRole,
  date: date
}
  const key = new NodeRSA();
  key.importKey(publicKey, 'pkcs8-public-pem');
  
  const encrypted = key.encrypt(JSON.stringify(data), 'base64');


  const myHeaders = new Headers();
myHeaders.append("apiKey", "uKiz0x8w9yrAm3WoG9wMrLm7DvN2Rlk7jV4dv93i1cmEgL414tN7DAdqSpSvgXvH");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");

const raw = JSON.stringify({
  "collection": "totCandidateData",
  "database": "wmpsc-api-collection",
  "dataSource": "wmpsc-mongo",
  "document": {data: encrypted}
});


const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

await fetch("https://ap-south-1.aws.data.mongodb-api.com/app/data-kytrg/endpoint/data/v1/action/insertOne", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    let data = JSON.parse(result)
    if(data.insertedId === undefined){
      res.json({
        status: "Error",
        result: result
      })
    } else {
      res.json({
        status: "Completed!",
        statusCode: 200,
        results: data.insertedId
      });
    }
  })
  .catch((error) => {
    res.json({
      status: "Error",
      result: error
    })
  });

})

router.post("/getDataFromEncryption", async (req, res) => {

  console.log(req.body);
  var id = JSON.parse(req.body);
  const myHeaders = new Headers();
  myHeaders.append("apiKey", "uKiz0x8w9yrAm3WoG9wMrLm7DvN2Rlk7jV4dv93i1cmEgL414tN7DAdqSpSvgXvH");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");
  
  const raw = JSON.stringify({
    "collection": "totCandidateData",
    "database": "wmpsc-api-collection",
    "dataSource": "wmpsc-mongo",
    "filter": {
      "_id": {
        "$oid": id.id
      }
    }
  });
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch("https://ap-south-1.aws.data.mongodb-api.com/app/data-kytrg/endpoint/data/v1/action/findOne", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      result = JSON.parse(result);
      const key = new NodeRSA();

      const privatePem = privateKey;
      key.importKey(privatePem, 'pkcs1-pem');
      
      // read the encrypted data from service call
      const decryptedString = key.decrypt(result.document.data, 'utf8');
      
      // console.log('\nDECRYPTED string: ');
      // console.log(decryptedString);
      const decrypedObject = JSON.parse(decryptedString);
      res.json({
        result: decrypedObject,
        res: 200
      })
    })
    .catch((error) => {
      res.json({
        error: error
      })
    });

})

router.get("/a", (req, res) => {
  res.json({
    hello: "hi!",
    // private: key.exportKey('pkcs1-public-pem'),
    // public: key.exportKey('pkcs8-pem')
  });
  console.log('\nPUBLIC:');
  console.log(key.exportKey('pkcs8-public-pem'));
  console.log('\nPRIVATE:');
  console.log(key.exportKey('pkcs1-pem'));
});

router.post("/encrypt", (req, res) => {
  const key = new NodeRSA();
key.importKey(publicKey, 'pkcs8-public-pem');

const data = JSON.parse(req.body);
const encrypted = key.encrypt(JSON.stringify(data), 'base64');
console.log('ENCRYPTED:');
console.log(encrypted);
console.log(req);
res.json({
  status: 'OK',
  data: encrypted
});
})

router.post("/decrypt", (req, res) => {
  const key = new NodeRSA();

  data = JSON.parse(req.body);
  console.log(data.decrypt);
  // TODO: read private key from file and keep it secret and secure. Do not put this private key into code!
  const privatePem = privateKey;
  key.importKey(privatePem, 'pkcs1-pem');
  
  // read the encrypted data from service call
  const decryptedString = key.decrypt(data.decrypt, 'utf8');
  
  console.log('\nDECRYPTED string: ');
  console.log(decryptedString);
  const decrypedObject = JSON.parse(decryptedString);
res.json({
  status: 'OK',
  data: decrypedObject
});
})

router.get("/test-get-api", async (req, res) => {
console.log(req.query.id);
const myHeaders = new Headers();
myHeaders.append("apiKey", "uKiz0x8w9yrAm3WoG9wMrLm7DvN2Rlk7jV4dv93i1cmEgL414tN7DAdqSpSvgXvH");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");

const raw = JSON.stringify({
  "collection": "questions",
  "database": "wmpsc-api-collection",
  "dataSource": "wmpsc-mongo",
  "filter": {
    "jobRole": req.query.id
  }
});


const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

await fetch("https://ap-south-1.aws.data.mongodb-api.com/app/data-kytrg/endpoint/data/v1/action/insertOne", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    console.log(JSON.parse(result))
    // let data = result
    // // data = JSON.parse(data.document);
    let data = JSON.parse(result)
    res.json({
      hello: "hi!",
      results: data.document.name
    });
  })
  .catch((error) => console.error(error));


  
});





app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
