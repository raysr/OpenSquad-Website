let connection = require('./config/db');
class User{
	constructor(row){
		this.row=row;
	}
	get email(){return this.row.email;}
	get password(){return this.row.password;}
	get firstname(){return this.row.firstname;}
	get lastname(){return this.row.lastname;}
validPassword(password){
	console.log('Password donné : '+password);
	console.log('Password de l\'user :'+this.row.password);
	return password===this.row.password;
}
static subscribe(content, callback){
	connection.query('INSERT INTO user SET firstname=? , lastname=?, password=?, email=?',[content.firstname,content.lastname,content.password,content.email],(err, result)=>{
		if(err) throw err;

		callback();
	})
}

static findOne(ob,callback){
	connection.query('SELECT * from user WHERE email=? LIMIT 1',[ob.username],(err, rows)=>{
		if(err) throw err;
		callback(err, new User(rows[0]));
	})
}


static getFirstName(ob,callback){
	connection.query('SELECT firstname from user WHERE id=? LIMIT 1',[ob], (err, rows)=>{
		if(err) throw err;
		callback(firstname);
	})
}

}


module.exports = User;