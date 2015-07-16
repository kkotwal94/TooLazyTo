var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/posts/' + sub + '/getPost';
var name;
var href;
var href2;
var myposts;
console.log(sub);

var PostFiller = React.createClass({
  

    
  
   getPost : function() {
      $.ajax({
            url: id,
            dataType: 'json',
            success: function(data) {
               
   
               
               this.setState({post:data});
               console.log(data);
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
               window.location.href = "/postDoesntExists";
            }.bind(this)
        });
    },
   
   getUser : function() {
    $.ajax({
            url: '/u/' + sub,
            dataType: 'json',
            success: function(data) {
               
   
               
               
               name = data.local.email;
               href = '/user/' + data._id;
			   
			   myposts = data.local.posts;
               this.setState({user:data});
               
            }.bind(this),
        error: function(xhr, status, err) {
                console.log("error");
                window.location.href = "/postDoesntExist";
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },
   
    getLoggedUser : function() {
   $.ajax({
            url: '/user',
            dataType: 'json',
            success: function(data) {
			   
               this.setState({currentuser:data.local, userid : data});

			  href2 = data._id;
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },

   getInitialState: function() {
       return {
          post: [],
          user: [],
		  currentuser : [],
      userid: [],
          
       }
    },

    componentDidMount: function() {
    this.getUser();
        this.getPost();
        this.getLoggedUser();
		        //setInterval(this.loadPostsFromServer, this.props.pollInterval);
       
    },

    render: function() {
            return(
			<div>
            <div className = "CommentFiller">
            
            
            
            <Header posts = {this.state.post} users = {this.state.user} user = {this.state.currentuser} userid = {this.state.userid}/>
            </div>
           
            
           
           
			</div>
            )
          }
});


var Header = React.createClass({ //has to be called Header
    
    render: function() {

    var j = " " + this.props.posts.body + " ";
    var posts = this.props.posts; 
	
	var pid = this.props.posts._id;
	console.log("PID: " + pid);
    var user = this.props.users;
	var currentuserposts = this.props.user.posts;
  var realhref = this.props.userid._id;
    var upvoted = this.props.user.upvotedP;
	var downvoted = this.props.user.downvotedP;
	var self = this;

  console.log(realhref);

	if (upvoted != undefined) {
	  var style = {
        color: upvoted.indexOf(posts._id) > -1 ? 'rgb(0, 255, 0)' : 'rgb(64, 77, 91)'
      };

	  var style2 = {
	    color: downvoted.indexOf(posts._id) > -1 ? 'rgb(255, 0, 0)' : 'rgb(64, 77, 91)'
	  }
	  var edit = {
	     display: currentuserposts.indexOf(posts._id) > -1 ? '' : 'None'
	   }
	  }
	  else {
	  
	   var edit = {
	     display: 'None'
	  }
	  }
	 var tag = "#upvote" + posts._id;
	 var tag2 = "#downvote" + posts._id;
	 var tag3 = "#numbah" + posts._id;
	var tracker = posts.upvotes;
    return(
	<div>
    <ul className = "list-unstyled">
    {
    
         <div>
   <div className = "inlinegroup"> 
         <div id = "upvote1" className = "inline"><span style = {style} id = {"upvote" + posts._id} className = "glyphicon glyphicon-menu-up" 
         onClick =
{function(event){

 
$.ajax({
            url:  '/posts/' + posts._id + '/upvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
			var color = $(tag).css('color');
      var color2 = $(tag2).css('color');
			
			
			console.log(tracker);
			 
      

	   if (color == "rgb(64, 77, 91)"){
		  
          if (color2 == "rgb(255, 0, 0)"){

         
		   
            $(tag).css('color', 'rgb(0, 255, 0)');
            $(tag2).css('color', 'rgb(64, 77, 91)');
			tracker = tracker + 2;
            $(tag3).text(tracker);
            console.log("Hits");
			
			console.log(tracker);
            $.ajax({
            url:  '/posts/' + posts._id + '/downvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              console.log("We got the downvote nulled");


          }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
          }

          else {
			  $(tag).css('color', 'rgb(0, 255, 0)');
			   $(tag2).css('color', 'rgb(64, 77, 91)');
			   tracker = tracker + 1;
			   console.log(tracker);
			  $(tag3).text(tracker);
			  
			  console.log("Hit");
			  
			  }
      }
       
       
			 
        else {
			  console.log("Sup?");
			  
			   $(tag).css('color', "rgb(64, 77, 91)");
         console.log(color2);
		 tracker = tracker - 1;
		 console.log(tracker);
			    $(tag3).text(tracker);
				
			  }
              
              console.log("upvoted");
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
        
}
}
></span></div> <div className ="inline"><span id = {"numbah" + posts._id}>{posts.upvotes}</span> </div> <div className = "inline"><span style = {style2} id = {"downvote" + posts._id}className = "glyphicon glyphicon-menu-down" 
onClick =           
{function(event){
  
  

 $.ajax({
            url: '/posts/' + posts._id + '/downvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              //console.log(data);
              console.log("downvote");
			  var color = $(tag2).css('color');
        var color2 = $(tag).css('color');
        console.log(color);
        console.log(color2);
		
			 if (color == "rgb(64, 77, 91)"){
          if (color2 == "rgb(0, 255, 0)"){

         

            $(tag2).css('color', 'rgb(255, 0, 0)');
            $(tag).css('color', 'rgb(64, 77, 91)');
            tracker = tracker - 2;
			$(tag3).text(tracker);
			console.log(tracker);
            console.log("Hits");

            $.ajax({
            url:  '/posts/' + posts._id + '/upvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              console.log("We got the upvote nulled");


          }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
          }

          else {
        $(tag).css('color', 'rgb(64, 77, 91)');
         $(tag2).css('color', 'rgb(255, 0, 0)');
        tracker = tracker - 1;
		console.log(tracker);
		$(tag3).text(tracker);
        console.log("Hit");
        }
      }

			  else {
			 
			   $(tag2).css('color', "rgb(64, 77, 91)");
			   tracker = tracker + 1;
				console.log(tracker);
			   $(tag3).text(tracker);
			  }
			  
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    
  
}
}


></span></div></div><li className ="inlinelist" key = {posts._id}> <h4>{posts.title}</h4>

         <p><a href = {'/posts/' + posts._id} >{posts.allComments} comments</a> Created By: {posts.author} on: {new Date(posts.date).toUTCString()}</p>
         
          </li>
          <div className = "panel panel-primary">
          <div className = "panel panel-heading">{posts.title}</div>
          <div className = "panel panel-body">
          <div dangerouslySetInnerHTML={{__html : j }} />
          </div>
          <div className = "panel panel-footer">
          <a href = {href}>View : {name}s profile</a> <span style = {edit}>Since this is your post: <a href = {'/edit/' + realhref + '/' + posts._id} >Edit Post</a></span>
          </div>
          </div>
</div>
         
     
    }
   </ul>
   </div>

    )

    }
  
   });






//console.log(sub);
React.render(<PostFiller  pollInterval={postInterval}/>,
document.getElementById('createComments'));

