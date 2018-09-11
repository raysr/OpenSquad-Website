let connection = require('./config/db');
let moment = require('moment');

class Post{
constructor(row){
	this.row=row;
}
get content(){return this.row.content;}
get author_id(){return this.row.author_id;}
get title(){return this.row.title;}
get categories(){return this.row.categories;}
get date(){
		return moment(this.row.date);
	}
static send(author_id , firstname ,post, callback){
	console.log('id : '+author_id);
connection.query('INSERT INTO post SET firstname=? ,author_id=? , content=? , categories=? , date = ?, title=?',[firstname,author_id,post.content,post.categories,new Date(),post.title], (err ,result)=>{
	if(err) throw err;
	callback(result);
})
}


static all(callback){
	connection.query('select * from post',(err, rows)=>{
		if(err) throw err;
		callback(rows.map((row)=> new Post(row)));
	});
}



}

module.exports=Post;
