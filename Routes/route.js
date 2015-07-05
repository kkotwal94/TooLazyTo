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
    
    app.get('/user', function (req, res) {
        var id = req.user;
        res.json(id);
    });

    app.post('/updateProfile', function (req, res) {
        var id = req.user;
       
           
        if (req.body.firstName == "") {
            req.body.firstName = req.user.local.firstName;
        }
        if (req.body.lastName == "") {
            req.body.lastName = req.user.local.lastName;
        }
        if (req.body.dob == "") {
            req.body.dob = req.user.local.dob;
        }
        if (req.body.schoolYear == "") {
            req.body.schoolYear = req.user.local.schoolYear;
        }
        
        User.findById(id, function (err, user) {
            user.local.firstName = req.body.firstName;
            user.local.lastName = req.body.lastName;
            user.local.dob = req.body.dob;
            user.local.schoolYear = req.body.schoolYear;
            
            user.save();
        
        });
        res.json(req.body);
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
        var myDate = Date();
        posts.date = myDate;
        console.log(posts);
        
       
        User.findById(req.user.id, function (err, user) {
            console.log(user);
            user.local.posts.push(posts);
            user.local.postsCount = user.local.postsCount + 1;
            posts.author = user.local.email;
            posts.owner = user;
            posts.save();
            user.save();
            res.json(req.body);
        });
    });

    app.get('/allPosts', function (req, res) {
        Post.find({}, function (err, posts) {
            res.json(posts); 
        });
    });

    app.get('/u/:postid', function(req, res) {
        var id = req.params.postid;
        Post.findById(id, function(err, posts) {
            console.log(posts);
            User.findById(posts.owner, function(err, user) {
                res.json(user);
            });
   });
    });

//Post upvotes ------------------------------------------------------>
   app.put('/posts/:upvote/upvote', isLoggedIn, function(req, res) {
     var id = req.params.upvote;
     console.log(req.user.local.upvotedP);
     if(contains(req.user.local.upvotedP, id)) {
        req.user.save();
        console.log("This has already been upvoted!");
     Post.findById(id, function(err, posts) {
        posts.downvote(function(err, post) {
        var uid = posts.owner;
        User.findById(uid, function(err, users) {
            users.local.upvotes = users.local.upvotes - 1;
            users.save();
            res.json(posts);
        });
    });
     });
    }
    else {
        console.log("First time upvoting!");
        Post.findById(id, function(err, posts) {
        posts.upvote(function(err, post) {
        
        
        User.findById(posts.owner, function(err, users) {
            users.local.upvotes = users.local.upvotes + 1;
            users.local.upvotedP.push(posts);
            users.save();
            res.json(posts);
        });
    });
     });
    }

    
   });
//Post upvotes ------------------------------------------------------>

//Post downvotes ---------------------------------------------------->
   app.put('/posts/:downvote/downvote', isLoggedIn, function(req, res) {
     var id = req.params.downvote;
     if(contains(req.user.local.downvotedP, id)) {
        req.user.save();
        console.log("This has already been downvoted");
     Post.findById(id, function(err, posts) {
        posts.upvote(function(post, err) {
        var uid = posts.owner;
        User.findById(uid, function(err, users) {
            users.local.upvotes = users.local.upvotes + 1;
            users.save();
            res.json(posts);
        });
      });
     });
    }
    else {
        console.log("First time downvoting");
        Post.findById(id, function(err, posts) {
        posts.downvote(function(post, err) {
        var uid = posts.owner;
        User.findById(uid, function(err, users) {
            users.local.upvotes = users.local.upvotes - 1;
            users.local.downvotedP.push(posts);
            users.save();
            res.json(posts);
        });
    });
     });
    }

    
   });



//Post downvotes ---------------------------------------------------->

 app.get('/posts/:posts', function(req, res) {
    res.render('comments.ejs', { user     : req.user});
});

 app.get('/posts/:posts/getPost', function(req, res) {
    var id = req.params.posts;
    Post.findById(id, function(err, posts) {
        res.json(posts);
    });
 });

 app.get('/user/:user', function(req, res) {
    res.render("profile.ejs", {user : req.user});
 });


 app.get('/profile/:user', function(req, res) {
    var id = req.params.user;
    User.findById(id, function(err, user) {
        res.json(user);
    });
 });

app.get('/userPosts/:user', function(req, res) {
    var id = req.params.user;
    Post.find({"owner" : id}, function(err, post) {
        res.json(post);
    });
});


app.get('/userComments/:user', function(req, res) {
    var id = req.params.user;
    Comment.find({"owner" : id}, function(err, comment) {
        res.json(comment);
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
//================database Contains=====================//
function contains(arr, id) {
    for (var i = 0; i < arr.length; i++) {
       
        console.log(arr);
        if (arr[i] == id) {
            console.log("splicing!");
            console.log(arr[i]);
            arr.splice(i, 1);
            console.log(arr);
            return true;
        }
    }
    console.log('coming back false');
    return false;
}
