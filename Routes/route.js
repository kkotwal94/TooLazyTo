module.exports = function (app, passport) {
    //homepage
    var mongoose = require('mongoose');
    require('../Schema/Comments.js');
    require('../Schema/Posts.js');
    var Post = mongoose.model('Post');
    var Comment = mongoose.model('Comment');
   
    
    
   
   app.get('/', function (req, res) {
        res.render('index.ejs'); //load the index.ejs file
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