module.exports = function (app, passport) {
    //homepage
    var mongoose = require('mongoose');
    require('../Schema/Comments.js');
    require('../Schema/Posts.js');
    var Post = mongoose.model('Post');
    var Comment = mongoose.model('Comment');
    var User = mongoose.model('User');
    
    
    
    app.get('/', function (req, res) {
        res.render('index.ejs', {
            message: req.flash('loginMessage'),
            smessage : req.flash('signupMessage'),
            user     : req.user
        }); //load the index.ejs file
    });
    
    
    //app/post ('/login', do all our passport stuff here)
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', //redirect to the secure profile section
        failureRedirect : '/', //redirect back to the signup page
        failureFlash : true //allow flash messages
    })
    );

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', //redirect to profile
        failureRedirect : '/' , //redirect back to the signup page
        failureFlash : true //allow flash messages
    })
    );

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/posts', isLoggedIn, function (req, res) {
        console.log(req.body);
        var posts = new Post(req.body);
        console.log(posts);
        posts.save();
       
        User.findById(req.user.id, function (err, user) {
            console.log(user);
            user.local.posts.push(posts);
            user.local.postsCount = user.local.postsCount + 1;
            user.save();
            res.json(req.body);
        });
    });

    app.get('/allPosts', function (req, res) {
        Post.find({}, function (err, posts) {
            res.json(posts); 
        });
    });

};



//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    //if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next(); //cuz we want to move on incase we're stuck here
    
    //if they arent redirect them to the home page
    res.redirect('/');
}
//================r/routes Contains=====================//
function contains(arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === id.toString()) {
            console.log(arr[i]);
            arr.splice(i, 1);
            return true;
        }
    }
    return false;
}