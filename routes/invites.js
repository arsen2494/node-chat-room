/**
 * Created by arsen on 7/10/17.
 */
const express=  require('express');
const router = express.Router();
const Room = require('../models/room');

router.get('/:token', (req, res) => {
    console.log(req.params.token);
    Room.findOne({ invite_token: req.params.token })
        .then(result => {
//            Room.update({})
            console.log(result);
            if (result) {
                res.redirect(`/rooms/${result._id}`);
                Room.update({ invite_token: req.params.token, }, { $unset: { invite_token: 1 } });
            }
            else
                res.redirect('/');
        })
        .catch(() => res.redirect('/'));
});
module.exports = router;