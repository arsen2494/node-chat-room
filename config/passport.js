const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('name', "Name is required").notEmpty();
    req.checkBody('email', "Email is required").notEmpty();
    req.checkBody('email', "Email is not valid").isEmail();
    req.checkBody('password', "Password is required").notEmpty();
    req.checkBody('password2', "Passwords do not match").equals(password);
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });

        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: "Email is already in use."});
        }
        let newUser = new User();
        newUser.name = req.body.name;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);

        newUser.save(function (err, newUser) {
            if (err) {
                return done(err);
            }

            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', "Email is required").notEmpty();
    req.checkBody('email', "Email is not valid").isEmail();
    req.checkBody('password', "Password is required").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });

        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { messages: "No user found."});
        }
        if (!user.validPassword(password)) {
            return done(null, false, { messages: "Wrong password"});
        }

        return done(null, user);
    });
}));