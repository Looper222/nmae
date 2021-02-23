const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkUser = (req, res, next) => {
    const token = req.cookies.authenticatedUser;

    if (token) {
        jwt.verify(token, 'Vt2jne6sk5vSqRXp', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

// logged in is needed to watch special pages
const requireAuth = (req, res, next) => {
    const token = req.cookies.authenticatedUser;

    if (token) {
        jwt.verify(token, 'Vt2jne6sk5vSqRXp', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/home');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/home');
    }
};

module.exports = {
    checkUser,
    requireAuth
};