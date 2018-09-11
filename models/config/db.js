let mysql = require('mysql');
let connection = mysql.createConnection({
	host:'localhost',
	user:'opensquad',
	password:'opensquad',
	database:'website',
});

module.exports= connection;