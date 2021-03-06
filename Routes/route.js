﻿module.exports = function (app, passport) {
    //homepage
    var mongoose = require('mongoose');
    require('../Schema/Comments.js');
    require('../Schema/Posts.js');
    var Post = mongoose.model('Post');
    var Comment = mongoose.model('Comment');
    var User = mongoose.model('User');
    var Promise = require('bluebird');
    var mongoose = require('mongoose');
    Promise.promisifyAll(mongoose);
    var deep = ".comments";
    var longpath = repeat(deep, 100);
    var comments = 'comments' + longpath;
    //console.log(comments);
    app.get('/postDoesntExist', function(req, res) {
        res.render('pageDoesNotExist.ejs',{
            message: req.flash('loginMessage'),
            smessage : req.flash('signupMessage'),
            user     : req.user }

            );
    });
    
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
        
        var posts = new Post(req.body);
        var myDate = Date();
        posts.date = myDate;
        
        
       
        User.findById(req.user.id, function (err, user) {
            
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

    app.get('/u/:postid', function(req, res, next) {
        var id = req.params.postid;
        Post.findById(id, function(err, posts) {
            
           
            
            if (posts == undefined) {
                res.redirect('/postDoesntExist');
            }
            if (posts!= undefined) {
            User.findById(posts.owner, function(err, user) {

                res.json(user);
            });
        }
            
   });
    });

//Post upvotes ------------------------------------------------------>
   app.put('/posts/:upvote/upvote', isLoggedIn, function(req, res) {
     var id = req.params.upvote;
     
     if(contains(req.user.local.upvotedP, id)) {
        req.user.save();
        
     Post.findById(id, function(err, posts) {
        if (posts == null) {
            res.json(posts);
        }
        else {
        posts.downvote(function(err, post) {
        var uid = posts.owner;
        User.findById(uid, function(err, users) {
            users.local.upvotes = users.local.upvotes - 1;
            users.save();
            res.json(posts);
        });
    });
    }
     });
    }
    else {
        
        Post.findById(id, function(err, posts) {
            if(posts == null) {
                res.json(posts);
            }
            else {
        posts.upvote(function(err, post) {
        
        
        User.findById(posts.owner, function(err, users) {
            users.local.upvotes = users.local.upvotes + 1;
                        req.user.local.upvotedP.push(posts);
                        req.user.save();
            users.save();
            res.json(posts);
        });
    });
    }
     });

    }

    
   });
    //Post upvotes ------------------------------------------------------>
    
    //Comment upvotes ------------------------------------------------------>
    app.put('/comments/:upvote/upvote', isLoggedIn, function (req, res) {
        var id = req.params.upvote;
        
        if (contains(req.user.local.upvotedC, id)) {
            req.user.save();
            
            Comment.findById(id, function (err, comments) {
                if (comments == null) {
                    res.json(comments);
                }
                else {
                comments.downvote(function (err, comment) {
                    var uid = comments.owner;
                    User.findById(uid, function (err, users) {
                        users.local.upvotes = users.local.upvotes - 1;
                        users.save();
                        res.json(comments);
                    });
                });
            }
            });
        }
        else {
            
            Comment.findById(id, function (err, comments) {
                if(comments == null) {
                    res.json(comments);
                }
                else {
                comments.upvote(function (err, comment) {
                    User.findById(comments.owner, function (err, users) {
                        users.local.upvotes = users.local.upvotes + 1;
                        req.user.local.upvotedC.push(comments);
                        req.user.save();
                        users.save();
                        res.json(comments);
                    });
                });
            }
            });
        }

    
    });
    //Comment upvotes ------------------------------------------------------>

    //Comment downvotes ---------------------------------------------------->
    app.put('/comments/:downvote/downvote', isLoggedIn, function (req, res) {
        var id = req.params.downvote;
        if (contains(req.user.local.downvotedC, id)) {
            req.user.save();
            
            Comment.findById(id, function (err, comments) {
                if (comments == null) {
                    res.json(comments);
                }
                else {
                comments.upvote(function (comment, err) {
                    var uid = comments.owner;
                    User.findById(uid, function (err, users) {
                        users.local.upvotes = users.local.upvotes + 1;
                        users.save();
                        res.json(comments);
                    });
                });
            }
            });
        }
        else {
            
            Comment.findById(id, function (err, comments) {
                if (comments == null) {
                    res.json(comments);
                }
                else {
                comments.downvote(function (comment, err) {
                    var uid = comments.owner;
                    User.findById(uid, function (err, users) {
                        users.local.upvotes = users.local.upvotes - 1;
                        req.user.local.downvotedC.push(comments);
                        req.user.save();
                        users.save();
                        res.json(comments);
                    });
                });
            }
            });
        }

    
    });    

    //Comment downvotes ---------------------------------------------------->
    
    //Post downvotes ---------------------------------------------------->
   app.put('/posts/:downvote/downvote', isLoggedIn, function(req, res) {
     var id = req.params.downvote;
     if(contains(req.user.local.downvotedP, id)) {
        req.user.save();
     
     Post.findById(id, function(err, posts) {
        if(posts == null) {
            res.json(posts);
        }
        else {
        posts.upvote(function(post, err) {
        var uid = posts.owner;
        User.findById(uid, function(err, users) {
            users.local.upvotes = users.local.upvotes + 1;
            users.save();
            res.json(posts);
        });
      });
    }
     });
    }
    else {
        
        Post.findById(id, function(err, posts) {
            if(posts == null) {
                res.json(posts);
            }
            else {
        posts.downvote(function(post, err) {
        var uid = posts.owner;
        User.findById(uid, function(err, users) {
            users.local.upvotes = users.local.upvotes - 1;
            req.user.local.downvotedP.push(posts);
            req.user.save();
            users.save();
            res.json(posts);
        });
    });
    }
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

    app.get('/comment/:comment/getComment', function (req, res) {
        var id = req.params.comment;
        Comment.findById(id, function (err, comments) {
            res.json(comments);
        });
    });


app.get('/posts/:posts/getPost/comments', function(req, res) {
var id = req.params.posts;
 Post.findById(id).deepPopulate('comments' + longpath).execAsync() //i am looking for a form, using deeppopulate funct we fill out subforms to the 6th level, because I don't think there will be more than 6 levels, and if so we can just add in more..
        .then(function (doc) { //for the doc that the async call gets
             
            res.json(doc); //we send that doc with the populated fields  
        }).catch(function (err) { //if there is a error than tell us
            res.send('Something is wrong..' + err.message) //err.message holds true error, might be vague
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

app.post('/submit/:postid/comments',isLoggedIn, function(req, res) {
    var id = req.params.postid;
    var comments = new Comment();
   
    var myDate = Date();
    var author = req.user.local.email;
    var owner = req.user;
    
    comments.author = author;
    comments.date = myDate;
    comments.owner = owner;
    comments.body = req.body.body;
    
    req.user.local.comments.push(comments);
    req.user.save();
    Post.findById(id, function(err, post){
        if (post!=null) {
        comments.post = post;
            post.comments.push(comments);
            post.allComments = post.allComments + 1;
        post.save();
        comments.save();
    }

    });

    res.json(req.body);
});
    //edit post
    app.post('/edit/:user/:id', function (req, res) {
        var user = req.params.user;
        var pid = req.params.id;
        
      
            Post.findById(pid, function (err, post) {
                post.body = req.body.body;
                post.title = req.body.title;
                post.save();
            res.json(post);
                //res.redirect('/posts/' + pid)
            });
        
    });
    
    app.post('/editC/:user/:id', function (req, res) {
        var user = req.params.user;
        var cid = req.params.id;
        
        
        Comment.findById(cid, function (err, comment) {
            comment.body = req.body.body;
            
            comment.save();
            res.json(comment);
                //res.redirect('/posts/' + pid)
        });
        
    });
    
    app.get('/edit/:user/:id', isLoggedIn, function (req, res) {
        if (req.user == undefined) {
            res.redirect('/');
        }
        if (req.params.user != req.user._id) {
            res.redirect('/');
        }
        else {
            res.render('editPost.ejs', {
                user : req.user,
                message: req.flash('loginMessage'),
                smessage : req.flash('signupMessage')
            });
        }
    });
    
    app.get('/editc/:user/:id', isLoggedIn, function (req, res) {
        if (req.user == undefined) {
            res.redirect('/');
        }
        if (req.params.user != req.user._id) {
            res.redirect('/');
        }
        else {
            res.render('editComment.ejs', {
                user : req.user,
                message: req.flash('loginMessage'),
                smessage : req.flash('signupMessage')
            });
        }
    });
    app.post('/posts/:id', isLoggedIn, function (req, res) {

        var id = req.params.id;
        var comments = new Comment();
        var myDate = Date();
        var author = req.user.local.email;
        var owner = req.user;
        
        comments.author = author;
        comments.date = myDate;
        comments.owner = owner;
        comments.body = req.body.body;
        comments.pComment = req.body.parentCommentId;
        Post.findById(id, function (err, post) {
            if (post != null) {
            post.allComments = post.allComments + 1;
            
            req.user.local.comments.push(comments);
            req.user.save();
            comments.post = post;
            Comment.findById(req.body.parentCommentId, function (err, comm) {
            if(comm != null) {
                comments.nthNode = comm.nthNode + 1;
                comments.save();
                comm.comments.push(comments); //pushing in nested comment to parent
                comm.save();
                post.save();
                }
            });
           
         }
               
        });

        res.redirect('/posts/' + id);
    });
  
    app.put('/posts/delete/:user/:id', isLoggedIn, function(req, res) {
        var postid = req.params.id;
        var userid = req.params.user;
        if(req.user._id != userid) {
            res.redirect('/');
        }

        Post.findByIdAndRemove(postid, function(err) {
            if(err) throw err;
         
            res.redirect('/');
        });
    });

    //removing post
    app.put('/post/:postid/comment/delete/:user/:id',isLoggedIn, function(req, res) {
        var postid = req.params.postid;
        var commentid = req.params.id;
        var userid = req.params.user;
        if(req.user._id != userid) {
            res.redirect('/posts/' + postid);
        }
        //removing comment, subcomments

        Comment.findById(commentid, function(err, comm) {
            if(err) throw err;
            if(comm.comments.length == 0) {
                comm.remove(function(err) {
                    if(err) throw err;
                    res.redirect('/posts/' + postid);

                    Post.findById(postid, function(err, post) {
                        if(err) throw err;
                        post.allComments = post.allComments - 1;
                        post.save();
            
                        });
                    res.redirect('/posts/' + postid);
                    });
                }
            else {
            comm.body = "[deleted]";
            comm.author = "[deleted]";
            
  
         Post.findById(postid, function(err, post) {
            if(err) throw err;
            post.allComments = post.allComments - 1;
            post.save();
            comm.save();
         });
        res.redirect('/posts/' + postid);
    }
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
       
        
        if (arr[i] == id) {
            
            arr.splice(i, 1);
            
            return true;
        }
    }
    
    return false;
}
//credit to disfated@stackoverflow sick algorithm for joinign strings
function repeat(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
}