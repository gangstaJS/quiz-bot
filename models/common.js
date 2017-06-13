const { m, db } = require('../db');

let Questions = new m.Schema({
  question: String,
  answer: String
});

let q = m.model('Questions', Questions);

let Users = new m.Schema({
  id: String,
  name: String,
  score: Number
});

let u = m.model('Users', Users);

module.exports.loadQuestions = function() {
	return q.find({}, {_id: 0});
}

module.exports.score = function() {
	return u.find({}, {_id: 0, __v: 0}).sort({score: -1});
}

module.exports.setPoint = function(id, name,  score) {
	return u.findOneAndUpdate(
		{ id }, 
		{ $inc: { score }, name }, 
		{ upsert: true, new: true }
	);
}