const builder = require('botbuilder');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);

console.log('Starting...');
console.log('ENV', process.env.MICROSOFT_APP_ID, process.env.MICROSOFT_APP_PASSWORD);

app.use(bodyParser.json());

app.post('/api/messages', connector.listen());

app.get('/', (req, res) => {
	res.end('ok');
});

bot.dialog('/', function (session) {
	session.send('Coming soon');
});


app.listen(8180);
