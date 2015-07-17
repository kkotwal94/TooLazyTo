var link = window.location.href;
var array = link.split('/');
var sub = "/edit/" +array[array.length-2] + "/" + array[array.length-1];
var dub = array[array.length-1];
console.log(dub);
console.log(sub);

var EditProfile = React.createClass({
loadUserFromServer : function() {
	$.ajax({
		url: '/user',
		//type: 'GET',
		dataType: 'json',
		success: function(data) {
			console.log(data);
			this.setState({users: data.local, currentUser:data });
			
			
		}.bind(this),
		error: function(xhr, status, err) {
		 console.error(this.props.url, status, err.toString());
		}.bind(this)
	});
},

getPost : function() {
      $.ajax({
            url: '/posts/' + dub + '/getPost',
            dataType: 'json',
            success: function(data) {
               
   
               console.log(data);
               this.setState({post:data});
               
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },

getInitialState: function() {
    return {
	 
	  users: [],
    currentUser :[],
	  post:  []
	};
},

componentDidMount: function() {
       
		this.loadUserFromServer();
		this.getPost();
	
    },
handlePSubmit : function(data,callback) {
    
	$.ajax({
	    url: sub, 
		dataType:'json',
		type: 'POST',
		data: data,
		success: function() {
			
					callback;  

					window.location.href = '/posts/' + dub;
					},
		error: function(xhr, status, err) {
		console.log("failed");
		console.error(this.props.url, status, err.toString());
		
		}.bind(this)
	});

   },
   render: function() {
            
            return(
                  
            <div>

			
			
			<hr/>
			<EditForm onSubmit={this.handlePSubmit} user = {this.state.users}/>
			<hr/>
			<EditViews user = {this.state.users} posts = {this.state.post} currentUser = {this.state.currentUser}/>
			

			
            <hr/>
            
            
            
            </div>
            )
          }
});





var EditForm = React.createClass({

     handleSubmit : function(e) {
       e.preventDefault();
       var title  = React.findDOMNode(this.refs.title).value.trim();
       var body   = React.findDOMNode(this.refs.body).value.trim();
      
       if(!title || !body) {
		  alert("You have to complete all fields!");
          return;
       }
       this.props.onSubmit({title:title, body:body});
       React.findDOMNode(this.refs.title).value = '';
       React.findDOMNode(this.refs.body).value = '';
       
       },
    render: function() {
       return (
	   <div>
         <form className="postForm" onSubmit={this.handleSubmit}>
		  <div class="form-group">
			<label>Thread Name</label>
            <input type = "text" className = "form-control" placeholder="Title..." ref="title"/>
         </div>
		 <div class="form-group">
			<label>Enter body here</label>
			<div id = "ck">
            <textarea id = "ckedit2" className = "form-control" placeholder="Say Something for post body.." ref="body"></textarea>
		    </div>
		</div>
            <button type = "submit" className = "btn btn-primary" value="Post">Submit!</button>
         </form>
		 </div>
   );
  }
 });

	var EditViews = React.createClass ({

		render: function() {

    var j = " " + this.props.posts.body + " ";
    var posts = this.props.posts; 
	var pid = this.props.posts._id;
	console.log("PID: " + pid);
    var user = this.props.user;
    var username = this.props.user.email;
    var userid1 = this.props.currentUser._id;
    var userid = "/user/" + userid1

	var uid = this.props.user._id;
    var upvoted = this.props.user.upvotedP;
	var downvoted = this.props.user.downvotedP;
	var self = this;

	if (upvoted != undefined) {
	  var style = {
        color: upvoted.indexOf(posts._id) > -1 ? 'rgb(0, 255, 0)' : 'rgb(64, 77, 91)'
      };

	  var style2 = {
	    color: downvoted.indexOf(posts._id) > -1 ? 'rgb(255, 0, 0)' : 'rgb(64, 77, 91)'
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
          <a href = {userid}>View : {username}s profile</a> or <a>Give this user some Karma</a>
          </div>
          </div>
</div>
         
     
    }
   </ul>
   </div>

    )

    }
  
   });
React.render(<EditProfile  />,
document.getElementById('editPost'));

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


$(document).ready(function () {
		AlloyEditor.editable('ckedit2', {
		
                toolbars: {

	add: {
        buttons: ['image', 'camera', 'hline', 'table'],
        tabIndex: 2
    },
        styles: {
            selections: [
                {
                    name: 'text',
                    buttons: [{
                        name: 'styles',
                        cfg: {
                            styles: [
                                {
                                    name: 'Head 1',
                                    style: { element: 'h1' }
                                },
                                {
                                    name: 'Head 2',
                                    style: { element: 'h2' }
                                },
                                {
                                    name: 'Big',
                                    style: { element: 'big' }
                                },
                                {
                                    name: 'Small',
                                    style: { element: 'small' }
                                },
				{
				    name: 'Formatted',
				    style: {element: 'pre'}
				},
                                {
                                    name: 'Code',
                                    style: { element: 'code' }
                                },
                               { name: 'Inline Quotation', style:{element: 'q'} }
                            ]
                        }
                    },'quote','bold', 'italic', 'underline', 'link', 'twitter','subscript','superscript', 'ul', 'ol'],
                    test: AlloyEditor.SelectionTest.text
                }
            ]
        }
    }




});
    
});