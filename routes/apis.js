  var express = require('express');
var task = require('../models/DB');
var router = express.Router();

/* Delete function */
router.get('/delete/:id', function(req, res, next) {
    res.send("This is delete function");
});

router.post('/register', function(req, res, next) {
    task.User.create({
            username: req.body.username,
            password: req.body.password
        }).then(function() {
            req.session.message = "User created";
            req.session.logined = false;
            console.log("User created");
            res.redirect('/');
        })
        .catch(function(err) {
            console.log(err.message);
            req.session.message = err.message;
            res.redirect('back');
        });
});
/* Login function */
router.post('/login', function(req, res, next) {
    task.User.findOne({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    }).then(function(User) {
        if (User != null) {
            req.session.username = User.username;
            req.session.password = User.password;
            req.session.logined = true;
            console.log("User Logined");
            res.redirect('/');
        } else {
            res.redirect(404,'back');
        }
    }).catch(function(error) {
        console.log(error)
    });;
});

/* Logout function */
router.post('/logout', function(req, res, next) {
    res.send("This is the logout function");
});

/* Add project function */
router.post('/add_project', function(req, res, next) {
    res.send("This is the add project function");
});

/* Update project */
router.post('/update_project/:id', function(req, res, next) {
    res.send("This is the update project function");
});

/* Add beacon function */
router.post('/add_beacon', function(req, res, next) {
    res.send("This is the add beacon function");
});

/* Update beacon */
router.post('/update_beacon/:id', function(req, res, next) {
    res.send("This is the update beacon function");
});

module.exports = router;
