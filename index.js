require("dotenv").config();
const request = require('request');
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 8080;
const COMETCHAT_APP_ID = process.env.COMETCHAT_APP_ID;
const COMETCHAT_REGION = process.env.COMETCHAT_APP_REAGION;
const COMETCHAT_API_KEY = process.env.COMETCHAT_API_KEY;
// this is a sample group for the learning purpose. It should be removed in the future. 
const GENERAL_GROUP_GUID = process.env.GENERAL_GROUP_GUID;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const joinGroup = (body) => {
  const options = {
    "method": "POST",
    "url": `https://${COMETCHAT_APP_ID}.api-${COMETCHAT_REGION}.cometchat.io/v3/groups/${GENERAL_GROUP_GUID}/members`,
    "headers": {
     "apiKey": `${COMETCHAT_API_KEY}`
    },
    "body": {
     "participants": [
      `${body.AccountSid}`
     ]
    },
    "json": true
   };
   
   request(options, function (error, response, b) {
     console.log('Join group: ');
     console.log(b);
   });
};

const addNewMember = (body) => {
  const options = {
    "method": "POST",
    "url": `https://${COMETCHAT_APP_ID}.api-${COMETCHAT_REGION}.cometchat.io/v3/users`,
    "headers": {
      "apiKey": `${COMETCHAT_API_KEY}`
    },
    "body": {
      "uid": `${body.AccountSid}`,
      "name": `${body.ClientIdentity}`
    },
    "json": true
  };

  request(options, function (error, response, b) {
    if (b && b.data) {
      joinGroup(body);
    }
  });
};

app.post('/webhook/cometchat', (req, res) => {
  console.log('Coming event - Twilio: ');
  console.log(req.body);
  const body = req.body;
  if (body.EventType === 'onMemberAdd') {
    addNewMember(body);
  }
  res.status(200).jsonp({ message: 'Done' });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});