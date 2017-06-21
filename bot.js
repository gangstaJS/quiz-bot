const builder = require('botbuilder');
const express = require('express');
const { initMongo } = require('./db');
const { loadQuestions, setPoint, score } = require('./models/common');
const bodyParser = require('body-parser');
const fs = require('fs');
const { shuffle } = require('./helpres');
const app = express();
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

initMongo();

loadQuestions().then(initApp).catch(err => console.log(err));

const bot = new builder.UniversalBot(connector);

console.log('Starting application...');
console.log('ENV', process.env.MICROSOFT_APP_ID, process.env.MICROSOFT_APP_PASSWORD);

function initApp(questions) {
	app.use(bodyParser.json());
	app.post('/api/messages', connector.listen());
	app.get('/', (req, res) => res.end('ok'));

	let users = {};

	questions = shuffle(questions);
	let currentIndexQuestion = 0;
	let currentQuestion = null;
	let tryes = 10;

	const avalaibleComands = {
		'score': 'showScore',
		'skip': 'skip',
		'tip': 'tip',
		'list': 'list',
	};

	class CommandMachine {
		static showScore(s) {
			return score().then(r => {
				let sc = '';
      	r.forEach((st, i) => {
      		sc += `${i+1}. (bronzemedal) __${st.name}__: _${st.score}_\n\n`;
      	})

      	s.send(sc);
      });
		}

		static skip(s) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					tryes = 10;
					currentIndexQuestion++;
					currentQuestion = null
					currentQuestion = questions[currentIndexQuestion];
					s.send(questions[currentIndexQuestion].question);
				}, 0);
			});
		}

		static tip(s) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					s.send(questions[currentIndexQuestion].answer);
				}, 0);
			});
		}

		static list(s) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					let str = '';
					Object.keys(avalaibleComands).forEach((key, i) => {
						str += `${i+1}. ${key}\n\n`;
					})
					s.send(str);
				}, 0);
			});
		}
	}

	bot.dialog('/', function (session) {
		let message = prepareMsg(session.message.sourceEvent.text || '');

		console.log(questions[currentIndexQuestion].answer);

		// console.log(session.message);

		if(/=(.+)/ig.test(message)) {
			let match = /=(.+)/ig.exec(message);
			let command = ''

      if(match[1]) {
        command = match[1].trim();
      }

      if(command && avalaibleComands[command]) {
      	CommandMachine[avalaibleComands[command]](session)
				return;

      } else {
      	session.send('Undefined command: '+command)
      }

		}

		if(currentQuestion) {
			// check answers;

			if((''+questions[currentIndexQuestion].answer) == message) {
				currentIndexQuestion++;
				currentQuestion = null
				currentQuestion = questions[currentIndexQuestion];
				tryes = 10;

				setPoint(session.message.user.id, session.message.user.name, 1).then(r => {
					session.send(session.message.user.name+' _+1_ очко (like) ('+r.score+')');
					session.send(questions[currentIndexQuestion].question);
				});

				
				
			} else {
				if(tryes == 0) {
					tryes = 10;
					currentIndexQuestion++;
					currentQuestion = null
					currentQuestion = questions[currentIndexQuestion];
					session.send(questions[currentIndexQuestion].question);
					return
				}

				tryes--;

				session.send(session.message.user.name+' не верно (n) ('+ tryes +') попыток осталось');
			}
		} else {
			currentIndexQuestion++;
			currentQuestion = questions[currentIndexQuestion];
			session.send(questions[currentIndexQuestion].question);
		}

		console.log(questions[currentIndexQuestion].answer)

		
	});
	
	console.log('Starting complited');

	app.listen(8019);
}

function prepareMsg(msg) {
	msg = msg.split('\n').join(' ');

  if(/^Edited previous message:/i.test(msg)) {
      msg = msg.split('<e_m')[0];
  }

  msg = msg.split('</at>');

  msg = msg[msg.length-1];

  msg = ''+msg;

  return msg.trim();
}

