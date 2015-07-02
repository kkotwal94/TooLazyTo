var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


//define the schema for our users

var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
        firstName    : String, 
        lastName     : String,
        dob          : String,
        schoolYear   : String,
        posts        : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        comments     : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        postsCount   : { type: Number, default: 0 },
        commentsCount: { type: Number, default: 0 },
        upvotes      : { type: Number, default: 0 },
        karma        : { type: Number, default: 0 },
        title        : { type: String, default: "Superhero in Training" }
    }
});

//methods
//generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};


//make it modular and pass it to server.js
module.exports = mongoose.model('User', userSchema);