const fs = require('fs');
const iconv = require('iconv-lite');
const q = require('./data/q');



console.log(q.length);

// let content = fs.readFileSync('data/questions.txt');

// let str = iconv.decode(content, 'win1251');


// q = str.split('\r\n');

// q = q.map(el => {
// 	let el1 = el.split('|');
// 	return {question: el1[0], answer: el1[el1.length-1]}
// });



//console.log(fs.writeFileSync('data/q.json', JSON.stringify(q)));
