const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: String,
    title: String,
    text: String,
    creationDate: Date,
    comments: [
        {
            author: String,
            text: String,
            imageID: String,
            creationDate: Date,
            likes: Number,
            tags: Array,
            replies: [
                {
                    author: String,
                    text: String,
                    creationDate: Date,
                    likes: Number,
                }
            ]
        }
    ]
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;