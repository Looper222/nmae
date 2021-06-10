const mongoose = require('mongoose');
const { isStrongPassword } = require('validator');
const bcrypt = require('bcrypt');

// creating schema
const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, 'Plese enter your login'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        validate: [isStrongPassword, 'Please enter strong password']
    },
    posts: {
        type: Array
    }
});

// hash values
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static login user method
userSchema.statics.login = async function(login, password) {
    if (login.length > 0) {
        const user = await this.findOne({ login: login });
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                return user;
            }
            throw Error('incorrect password');
        }
        throw Error('incorrect login');
    }
};

// define model
const User = mongoose.model('user', userSchema);

module.exports = User;