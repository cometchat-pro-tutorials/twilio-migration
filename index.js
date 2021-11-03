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

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const doRequest = async (value) => {
  return new Promise((resolve, reject) => {
    request(value, (error, response, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
};

const createGroup = async (body) => {
  try {
    const options = {
      "method": "POST",
      "url": `https://${COMETCHAT_APP_ID}.api-${COMETCHAT_REGION}.cometchat.io/v3/groups`,
      "headers": {
        "apiKey": `${COMETCHAT_API_KEY}`
      },
      "body": {
        "guid": `${body.ChannelSid}`,
        "name": "general",
        "type": "public"
      },
      "json": true
    };

    const result = await doRequest(options);
    console.log('Create group: ');
    console.log(result);
    if (result && result.data) {
      await joinGroup(body);
    }
  } catch (error) {
    console.log(error);
  }
};

const joinGroup = async (body) => {
  try {
    const options = {
      "method": "POST",
      "url": `https://${COMETCHAT_APP_ID}.api-${COMETCHAT_REGION}.cometchat.io/v3/groups/${body.ChannelSid}/members`,
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
    const result = await doRequest(options);
    console.log('Join group: ');
    console.log(result);
    if (result && result.error && result.error.code && result.error.code === 'ERR_GUID_NOT_FOUND') {
      await createGroup(body);
    } else if (result && result.error && result.error.code && result.error.code === 'ERR_UID_NOT_FOUND') {
      await createUser(body);
    }
  } catch (error) {
    console.log(error);
  }
};

const createUser = async (body) => {
  try {
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
    const result = await doRequest(options);
    console.log('Create user:');
    console.log(result);
    if (result && result.data) {
      await joinGroup(body);
    }
  } catch (error) {
    console.log(error);
  }
};

const sendMessage = async (body) => {
  try {
    const options = {
      "method": "POST",
      "url": `https://${COMETCHAT_APP_ID}.api-${COMETCHAT_REGION}.cometchat.io/v3/messages`,
      "headers": {
        "apiKey": `${COMETCHAT_API_KEY}`,
        "onBehalfOf": `${body.AccountSid}`
      },
      "body": {
        "receiver": `${body.ChannelSid}`,
        "receiverType": "group",
        "category": "message",
        "type": "text",
        "data": { "text": `${body.Body}` }
      },
      "json": true
    };
    console.log('Send message: ');
    console.log(body);
    const result = await doRequest(options);
    console.log(result);
    if (result && result.error && result.error.code && result.error.code === 'ERR_GUID_NOT_FOUND') {
      await createGroup(body);
      await sendMessage(body);
    } else if (result && result.error && result.error.code && result.error.code === 'ERR_UID_NOT_FOUND') {
      await createUser(body);
      await sendMessage(body);
    } else if (result && result.error && result.error.code && result.error.code === 'ERR_NOT_A_MEMBER') {
      console.log('Here you are!!!');
      await joinGroup(body);
      await sendMessage(body);
    }
  } catch (error) {
    console.log(error);
  }
};

app.post('/webhook/cometchat', async (req, res) => {
  console.log('Coming event - Twilio: ');
  console.log(req.body);
  const body = req.body;
  if (body.EventType === 'onMemberAdded') {
    await createUser(body);
  }
  if (body.EventType === 'onMessageSent') {
    await sendMessage(body);
  }
  res.status(200).jsonp({ message: 'Done' });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});