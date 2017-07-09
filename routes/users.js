var express = require('express');
var router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

router.use(csrf({cookie: true}));

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', notLoggedIn, function (req, res, next) {
    let messages = req.flash('error');
    res.render('users/register', {
        title: "Register",
        csrfToken: req.csrfToken(),
        messages: messages,
        hasError: messages.length > 0
    });
});

router.post('/register', notLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/rooms',
    failureRedirect: '/users/register',
    failureFlash: true
}));

router.get('/login', notLoggedIn, function (req, res, next) {
    let messages = req.flash('error');
    res.render('users/login', {
        title: "Login",
        csrfToken: req.csrfToken(),
        messages: messages,
        hasError: messages.length > 0
    });
});

router.post('/login', notLoggedIn, passport.authenticate('local.signin', {
    successRedirect: '/rooms',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.get('/logout', isLogin, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;

function isLogin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}