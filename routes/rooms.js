const express = require('express');
const router = express.Router();
const csrf = require('csurf');
let Room = require('../models/room');

router.use(function (req, res, next) {
    console.log(req.cookies);
    console.log(req.body);
    next();
});
// router.use(csrf({cookie: true, ignoreMethods: ['PUT']}));


router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        let rooms = Room.find({}, function (err, rooms) {
            if (err) {
                res.status(500).send(err);
            }
            res.render('rooms/index', {title: "Rooms", rooms: rooms});
        })
    } else {
        let rooms = Room.find({canSee: 1}, function (err, rooms) {
            if (err) {
                res.status(500).send(err);
            }

            res.render('rooms/index', {title: "Rooms", rooms: rooms});
        })
    }
});

router.get('/create', isLogin, function (req, res, next) {
    let messages = req.flash('errors');
    res.render('rooms/create', {
        title: "Create chat room",
        csrfToken: req.csrfToken(),
        messages: messages,
        hasError: messages.length > 0,
    });
});

router.post('/', isLogin, function (req, res, next) {
    req.checkBody('name', "Name is required").notEmpty();
    req.checkBody('type', "Room type is required").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        req.flash('errors', messages);
        res.redirect('/rooms/create');
    } else {
        let room = new Room();

        room.name = req.body.name;
        room.type = req.body.type;
        room.canSee = req.body.availability;
        if (req.files.img) {
            let img = req.files.img;
            room.img = img.name;
            img.mv('public/images/' + img.name, function (err) {
                if (err) {
                    return res.status(500).send(err);
                } else {
                    room.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        res.redirect('/rooms');
                    });
                }
            });
        } else {
            room.save(function (err) {
                if (err) {
                    throw err;
                }
                res.redirect('/rooms');
            });
        }
    }
});

router.put('/:id', (req, res) => {
    const {token} = req.body;
    Room.update({_id: req.params.id}, {$set: {invite_token: token}})
        .then(() => res.status(200).send())
        .catch(e => res.status(500).send(e));
});
router.get('/:id', function (req, res, next) {
    Room.findOne({_id: req.params.id}, function (err, room) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.render('rooms/show', {title: room.name, roomId: req.params.id, room: room});
        }
    });
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