var express = require('express');
var router = express.Router();

function checkLogin (req, res, next) {
	if(req.session.user){
		return next();
	}else{
		res.redirect('/');
	}
}

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/powders', checkLogin, function(req, res) {
	con.query("SELECT * FROM powders", function (err, row) {
		if(err){ throw err; }
		else{
			res.render('powders',{rows:row});
		}
	});
});

router.get('/signUp', function(req, res) {
  res.render('signUp');
});

router.get('/insert', checkLogin, function(req, res) {
  res.render('insert');
});

router.get('/home', checkLogin, function(req, res) {
	var user = req.session.user;
  res.render('home', {
  	name: user.name,
  	username: user.username,
  	email: user.email
  });
});

router.post('/doLogin', function (req, res) {
	var body = req.body;
	con.query("SELECT * FROM users WHERE username = ? AND "
		+ "password = ?",[body.username, body.password],
		function (err, row) {
			if(err){ throw err;	}
			else{
				if(row.length > 0){
					req.session.user = row[0];
					return res.send({
						message: 'Welcome, '+row[0].username+' !',
						success: true
					});
				}else{
					return res.send({
						message: 'Please check your username and password',
						fail: true
					});
				}
			}
		});
});

router.get('/logout', checkLogin, function (req, res) {
	req.session.destroy();
	res.redirect('/');
});

router.post('/edit', checkLogin, function (req, res) {
	var body = req.body;

	console.log(body);

	console.log("UPDATE powders SET name=?,type=?,"+
		"price="+body.price+",starch=?,duration="+body.duration+" WHERE id="+body.id);

	con.query("UPDATE powders SET name=?,type=?,"+
		"price="+body.price+",starch=?,duration="+body.duration+" WHERE id="+body.id,
		[body.name, body.type, body.starch],
		function (err, row) {
			if(err){ throw err; }
			else{
				return res.send({
					message:'Data has been successfuly updated!',
					success: true});
			}
		});
});

router.post('/delete', checkLogin, function (req, res) {
	var body = req.body;

	console.log(body);
	console.log("DELETE FROM powders WHERE id="+body.id);
	con.query("DELETE FROM powders WHERE id="+body.id,
		function (err, row) {
			if(err){ throw err; }
			else{
				return res.send({
					message:'Data has been successfuly deleted!',
					success: true});
			}
		});
});

router.post('/doInsert', checkLogin, function (req, res) {
	var body = req.body;
	con.query("INSERT INTO powders VALUES(NULL,?,?,?,?,?)",
		[body.name,body.type,body.price,body.starch,body.duration],
		function (err, row) {
			if(err){ throw err; }
			else{
				return res.send({
					message: 'Baking Powder has been successfuly added!',
					success: true
				});
			}
		});
});

router.get('/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	failureRedirect: '/signUp'
}), function (req, res) {
	
	if(req.isAuthenticated()){
		var user = req.user;

		req.session.user = {
			name: user.name.givenName+user.name.middleName+user.name.familyName,
			email: user.email,
			username: user.displayName,
			password: ''
		};

		console.log(req.session.user);
		console.log(req.user);

		res.redirect('/home');
	}
});

router.post('/doSignUp', function (req, res) {
	var body = req.body;
	console.log(body);
	con.query("INSERT INTO users VALUES(NULL,?,?,?,?)",
		[body.name, body.username, body.email, body.password],
		function (err, row) {
			if(err){ throw err; }
			else{
				req.session.user = {
					name: body.name,
					username: body.username,
					email: body.email,
					password: body.password
				};
				return res.send({
					message: 'You have been successfuly signed up!',
					success: true
				});
			}
		});
});

module.exports = router;
