let bodyParser = require('body-parser');
let express = require('express'); 
let app = express();
let User = require('./models/user');
let Post = require('./models/post');
let { check, validationResult } = require('express-validator/check');
let util = require('util');




let flash=require("connect-flash");
app.use(flash());

let passport = require('passport')
let session = require('express-session')
let LocalStrategy = require('passport-local').Strategy;


// MIDDLEWARES 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// CONFIGURE SESSION AND AUTHENTICATION

passport.serializeUser((user, done) =>{
  done(null, user);
});

passport.deserializeUser((user, done) =>{
  done(null, user);
});


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  (username, password, done) =>{
    User.findOne({ username: username }, (err, user) =>{
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.use(session({
  secret: 'qdfkdslfkmqlk',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())





// -------------------- Template engine ---------------------

app.set('view engine','ejs');
app.use(express.static('public'));









// -----------------  ROUTES -------------------------

// ------------------- GET ---------------------------
app.get('/', (request, response)=>{

	let posts = Post.all((posts)=>{	response.render('index',{username:request.user!==undefined?request.user.row.firstname:undefined,posts:posts});})

});

app.get('/newpost/', (request, response)=>{
	if(!request.isAuthenticated()) response.redirect('/login');
	else{
response.render('newpost');
}
});


app.get('/login', (request, response)=>{
	response.render('login');
});



app.get('/subscribe', (request, response)=>{
	response.render('subscribe');
});



// ---------------------- POST --------------------------



app.post('/login',passport.authenticate('local',{successRedirect:'/',failureRedirect:'/login',failureFlash:true}));


app.post('/newpost', (request, response)=>{
	if(!request.isAuthenticated()) response.redirect('/login');
	else{
	Post.send(request.user.row.id, request.user.row.firstname ,request.body, ()=>{
		console.log('Post posted !');
		response.redirect('/');
	})
}});


app.post('/subscribe',  [
  check('email').isEmail(),
  check('password').isLength({ min: 5 })
]
, (request, response)=>{
	let errors=validationResult(request);
	if(!errors.isEmpty()) response.render('index',{error:'Error in form'});
	else{
	r={
		firstname:request.body['first-name'],
		lastname:request.body['last-name'],
		password:request.body['password'],
		email:request.body['email'],
	}
	user.subscribe(r, ()=>{
		response.render('index',{success:'Subscribed successfully !'})
	})
}});




app.listen(8080);