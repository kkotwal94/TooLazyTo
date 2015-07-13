var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/posts/' + sub + '/getPost/comments';
var name;
var href;
var finalData = [];
var d_id;
//var uid;
var counter = 0;
console.log(sub);

var CommentFiller = React.createClass({
  

    

  handleCommentSubmit : function(data,callback) {
    $.ajax({
    
    url: '/submit/' + sub +'/comments',
    dataType:'json',
    type: 'POST',
    data: data,
    success: function() {
          callback;  
          window.location.href = window.location.href;
          },
    error: function(xhr, status, err) {
    console.log("failed");
    console.error(this.props.url, status, err.toString());
    
    }.bind(this)
  });
   },

   getComments : function() {
      $.ajax({
              url: id,
            dataType: 'json',
            success: function(data) {
                for(var j = 0; j < data.comments.length; j++) { 
                for( var i = 0; i < data.comments.length-1; i++) {
				console.log("looping!");
                   if(data.comments[i].upvotes < data.comments[i+1].upvotes) {
				   console.log("hit");
                   var temp = data.comments[i];
                   data.comments[i] = data.comments[i+1];
                   data.comments[i+1] = temp;
                   }         
               }
             }
			
			         
                treeCycle(data);
                //console.log(data);
                data = finalData;
                //console.log(finalData[2]);
                
               
               
               this.setState({comments:data});
               //childrenCounter(finalData[1]);
               //console.log(childCounter);
            }.bind(this),
        error: function(xhr, status, err) {
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
			         //uid = data._id;
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
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

               this.setState({user:data});
               
            }.bind(this),
        error: function(xhr, status, err) {
                console.log("error");
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },
   


   getInitialState: function() {
       return {
          post: [],
          user: [],
          comments: [],
		  currentuser : [],
      userid : []
          
       }
    },

    componentDidMount: function() {
    this.getUser();
        this.getComments();
		this.getLoggedUser();
        
        
       
    },

    render: function() {
            return(
      <div>
            <div className = "Comment">
            
            <div className = "Submit">
			
			
             <CreateComment onCommentSubmit={this.handleCommentSubmit} />
            </div>
            
            <CommentList comments = {this.state.comments} user = {this.state.currentuser} userid = {this.state.userid}/>
            </div>
           
            
           
           
      </div>
            )
          }
});


var CommentList = React.createClass({ //has to be called list
		
	
	
    render : function() {
		 
    var upvoted = this.props.user.upvotedC;
	var downvoted = this.props.user.downvotedC;
	var userComment = this.props.user.comments;
  var uid = this.props.userid._id;
	/*var uid = this.props.user._id;*/
	var self = this;
var small = {
    fontSize: '10px'
  }
      return( 

		  <div className = "total">
          <ul className = "list-unstyled">
		  {
          this.props.comments.map(function(comment) {
	if (upvoted != undefined) {
	  var style = {
        color: upvoted.indexOf(comment._id) > -1 ? 'rgb(0, 255, 0)' : 'rgb(64, 77, 91)'
      };

	  var style2 = {
	    color: downvoted.indexOf(comment._id) > -1 ? 'rgb(255, 0, 0)' : 'rgb(64, 77, 91)'
	  }
	  }

    var parentDiv = "#" + comment.pComment;
    var childDiv = "#" + comment._id;

	 var tag = "#upvote" + comment._id;
	 var tag2 = "#downvote" + comment._id;
	 var tag3 = "#numbah" + comment._id;
	var tracker = comment.upvotes;
	 var userlink = "/user/" + comment.owner;
      
      
      
		 
		 if(upvoted!= undefined && comment.body != "[deleted]") {
		  var edit = {
	     display: userComment.indexOf(comment._id) > -1 ? '' : 'None',
       fontSize: '10px'
	   }
	  }
	  else {
	    userlink = "";
	   var edit = {
	     display: 'None'
	  }
	  }


		 
		 //editor1 = AlloyEditor.editable('ckedit' + comment._id);
		 
		  return(
			
			<div className = "userComments">
			
			<div id = {comment._id}>
			<div className = {"childs" + comment.nthNode} style = {{paddingLeft: 3*comment.nthNode + 'em'}}>
            <li><a href={userlink}><strong>{comment.author}</strong></a> <span id = {"numbah" + comment._id}>{comment.upvotes+" points"}</span> Posted on {comment.date} <a style = {{fontSize: 0.5 + "em"}}
			>(<span className = "glyphicon glyphicon-minus"></span>)</a></li>
			
			
			<li><div dangerouslySetInnerHTML={{__html : comment.body }} /></li>
			<li><span style = {style} id = {"upvote" + comment._id} className = "glyphicon glyphicon-chevron-up" 
			onClick =
{function(event){

 
 $.ajax({
            url:  '/comments/' + comment._id + '/upvote',
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
            $(tag3).text(tracker + " points");
            console.log("Hits");
			
			console.log(tracker);
            $.ajax({
            url:  '/comments/' + comments._id + '/downvote',
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
			  $(tag3).text(tracker+ " points");
			  
			  console.log("Hit");
			  
			  }
      }
       
       
			 
        else {
			  console.log("Sup?");
			  
			   $(tag).css('color', "rgb(64, 77, 91)");
         console.log(color2);
		 tracker = tracker - 1;
		 console.log(tracker);
			    $(tag3).text(tracker+ " points");
				
			  }
              
              console.log("upvoted");
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
        
}
}
			
			
			></span>&nbsp;<span style = {style2} id = {"downvote" + comment._id} className = "glyphicon glyphicon-chevron-down"
			onClick =           
{function(event){
	
	

 $.ajax({
            url: '/comments/' + comment._id + '/downvote',
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
			$(tag3).text(tracker+ " points");
			console.log(tracker);
            console.log("Hits");

            $.ajax({
            url:  '/comments/' + comment._id + '/upvote',
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
		$(tag3).text(tracker+ " points");
        console.log("Hit");
        }
      }

			  else {
			 
			   $(tag2).css('color', "rgb(64, 77, 91)");
			   tracker = tracker + 1;
				console.log(tracker);
			   $(tag3).text(tracker+ " points");
			  }
			  
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
 		
 		
 
}
}

			
			
			></span>&nbsp;<a  style = {small} role="button" data-toggle="collapse" href={"#collapseExample" + comment._id} aria-expanded="false" aria-controls="collapseExample">
  Reply
</a>&nbsp;<span style = {edit}><a href ={'/editC/' + uid + '/' + comment._id }>Edit Comment</a>&nbsp; <a onClick = {
  function(event){
    var x = confirm("Are you sure you want to delete this post?");
          if(x == true) {
            
            $.ajax({
            url:  '/post/' + sub + '/comment/delete/' +uid+"/"+ comment._id ,
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              console.log("We got comment deleted?");

              window.location.href = window.location.href;
          }.bind(this),
        error: function(xhr, status, err) {
                window.location.href = window.location.href;
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
          
            

          }

          else {
            alert("Guess we wont then");
          }
         }}
    >Delete Comment</a></span></li>
			<div className="collapse" id={"collapseExample" + comment._id}>
			<div id = "reply">
			<form   method = "post" id = "contactForm">
			<div className = "form-group">
			<input type="hidden" name="parentCommentId" value ={comment._id} />
			<textarea id = {"ckedit" + comment._id} name = "body"></textarea>
			</div>
			 
			<button type = "submit" className = "btn btn-primary">
			Save</button>
			</form>
			</div>
			
			</div>
			</div>
			</div>
			</div>
			)
			
			
			})
			}


              </ul>
			  </div>
        )
    }
  });



var CreateComment = React.createClass({
  handleSubmit : function(e) {
       e.preventDefault();
      
       var body   = React.findDOMNode(this.refs.body).value.trim();
      
       if(!body) {
          return;
       }
       this.props.onCommentSubmit({body:body});
       
       React.findDOMNode(this.refs.body).value = '';
       
       },
    render: function() {
       return (
         <form className="postForm" onSubmit={this.handleSubmit} >
      <div class="form-group">
      <label>Comment</label>
            <textarea id = "comments" className = "form-control" placeholder="Comment here!!.." ref="body">
			
			</textarea>
    </div>
            <button type = "submit" className = "btn btn-primary" value="Post">Submit!</button>
         </form>
   );
  }
 });



//console.log(sub);
React.render(<CommentFiller />,
document.getElementById('comments'));

function treeCycle(data) {
    
   
    if(data.comments.length != 0)
    for(var x = 0; x < data.comments.length; x++)
    {
		
        finalData.push(data.comments[x]);
        if(data.comments[x].comments.length != 0) {
           treeCycle(data.comments[x]);
        }
    }
//console.log(finalData);    
}
var childCounter = 1;

function childrenCounter(data) {
    
    console.log(data);
    if(data.comments.length != 0)
    for(var x = 0; x < data.comments.length; x++)
    {
    
        finalData.push(data.comments[x]);
        childCounter = childCounter + 1;
        console.log("childrenCounter: " + childCounter);
        console.log(data.comments[x].comments);
        if(data.comments[x].comments.length != 0) {
           console.log("Hit tree if statement");
           childrenCounter(data.comments[x]);
        }
    }
//console.log(finalData);    
}

$(document).ready(function () {
		AlloyEditor.editable('commenter', {
		
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




/*Original jsx attempt at tree collapses*/
		 /* if(comment.nthNode != 0) {
		  if(counter == comment.nthNode - 1) {
		  d_id = d_id + " " +comment.pComment;
		  counter = comment.nthNode;
		  }
		  else {
		  console.log("starting new tree from " + comment.pComment); //start our new tree here
		  d_id = d_id + " " +comment.pComment; //adding this comments parent to string
		  counter = comment.nthNode; //updating counter
		  var res = d_id.split(" "); //splitting string by " "
		  var t = res.length-counter; // setting the substrings we want [1,2,3,t,5,7] from t to end
		  console.log("//=========================//");
		  console.log(res);
		  console.log("//=========================//");
		  console.log("T: " + t);
		  var teststring =""; //our string we use in our array
		  for(var x = t; x<res.length; x++){
		  teststring = res[x] + " " + teststring +  " ";
		  }
		  console.log("TestString: "+ teststring);
		  d_id = "" + teststring;
		  }
		  }
		  else {
		  d_id = " ";
		  counter = 0;
		  }
		  console.log("ID: " + d_id);
		  console.log("Counter: " + counter);
		  */


