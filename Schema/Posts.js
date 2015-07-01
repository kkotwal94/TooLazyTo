var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title     : String,
    body      : String,
    author    : String,
    date      : { type: Date }, 
    upvotes   : { type: Number, default: 0 },
    comments  : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
    
});


PostSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

PostSchema.methods.downvote = function (cb) {
    this.upvotes -= 1;
    this.save(cb);
};

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
