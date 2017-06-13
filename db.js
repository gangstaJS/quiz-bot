const mongoose = require('mongoose');

const config = {
	DBHost: 'mongodb://192.168.99.100/quiz'
}

let options = {
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS : 30000
    }
  }
};

mongoose.Promise = global.Promise;

let connection = null;

// --

module.exports.initMongo = function() {

  mongoose.connect(config.DBHost, options);

  connection = mongoose.connection;

  connection.once('open', () => {
    console.log('Db connected');
  });

  connection.on('error', err => {
    console.log(err);
  });

};

module.exports.m = mongoose;

module.exports.db = connection;