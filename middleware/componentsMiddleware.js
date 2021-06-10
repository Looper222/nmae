const jwt = require('jsonwebtoken');

const idFromCookie = (req) => {
    const cookie = req.cookies['authenticatedUser'];
    const decodedCookie = jwt.decode(cookie);
    return userID = decodedCookie.id;
};

module.exports = {
    idFromCookie
}