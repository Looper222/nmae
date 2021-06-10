const Post = require('../models/Post');
const { idFromCookie } = require('../middleware/componentsMiddleware');
const User = require('../models/User');

const single_post_create = async (req, res)  => {
    const { title, text } = req.body;
    const creationDate = new Date().toUTCString();
    // idFromCookie(req);
    const { userID } = req.body;

    try {
        const user = await User.findById(userID).select('login').lean();
        const post = await Post.create({
            author: user.login,
            title: title,
            text: text,
            creationDate: creationDate,
            comments: []
        });

        const postID = post._id.toString();

        await User.findOneAndUpdate({ _id: userID }, { $addToSet: { posts: postID }}, { useFindAndModify: false }, function(err, result) {
            if (err) {
                console.log(err);
                res.status(400).json({ operationStatus: 'Failed'});
            } else {
                res.status(201).json({ operationStatus: 'Completed'});
            }
        })
    } catch (err) {
        console.log(err);
        res.status(400).json('Attempt failed');
    }
};

module.exports = {
    single_post_create
}