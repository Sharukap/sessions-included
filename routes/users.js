var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();

var User = require('../models/students');
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
	var user1 = req.body;

    var username = user1.username;
	var password = user1.password;
  if(!req.session.students) {
	//var authHeader = req.headers.authorization;
    
    
    if(username=="Jake" && password=="Cro7"){
		req.session.students = 'authenticated admin';
        res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({approved:true,Account_Type:"default_admin"});
		}
	else {
		    User.findOne({username: username})
			.then((students) => {
		
				  if (students === null) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({approved:"username doesn't exist"});
				  }
	    
				  else if (students.password !== password) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({approved:"password incorrect"});
				  }
	    
				  else if (students.username === username && students.password === password) {

					if(students.accounttype === "admin") {
						req.session.students = 'authenticated admin';
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({approved:true,Account_Type:students.accounttype});
					}
					  
					else {
						req.session.students = 'authenticated student';
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({approved:true,Account_Type:students.accounttype,record_Id:students.id});
					}
				  }
				})
		.catch((err) => next(err));
  
	}

  }

  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
	res.json({approved:"already logged in"});
  }
});

router.get('/check/:userName',(req,res,next) => {
    var username1 = req.params.userName;
    User.findOne({username: username1})
    .then((students) => {
      if (students === null) {
        var err = new Error('User ' + username + ' does not exist!');
        err.status = 403;
        return next(err);
      }
	    
      else {
        res.json({Name:students.name,Password:students.password,Email:students.email,Telnum:students.telnum,Address:students.address,Account_Type:students.accounttype,record_Id:students.id});
      }
    })
    .catch((err) => next(err));
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({approved:"logged out",account:req.params.studentId});
	req.session.students = 'logged out';
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
