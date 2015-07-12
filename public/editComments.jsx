var link = window.location.href;
var array = link.split('/');
var sub = "/editC/" +array[array.length-2] + "/" + array[array.length-1];
var dub = array[array.length-1];
var previous;
console.log(dub);
console.log(sub);
var name;
var href;
var EditComment = React.createClass({
loadUserFromServer : function() {
	$.ajax({
		url: '/user',
		//type: 'GET',
		dataType: 'json',
		success: function(data) {
			console.log(data);
			this.setState({users: data.local});
			
			
		}.bind(this),
		error: function(xhr, status, err) {
		 console.error(this.props.url, status, err.toString());
		}.bind(this)
	});
},

getComment : function() {
      $.ajax({
            url: '/comment/' + dub + '/getComment',
            dataType: 'json',
            success: function(data) {
               
   
               console.log(data);
               this.setState({comment:data});
			   previous = data.post;
               
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },

getInitialState: function() {
    return {
	 
	  users: [],
	  comment:  []
	};
},

componentDidMount: function() {
       
		this.loadUserFromServer();
		this.getComment();
	
    },
handleCSubmit : function(data,callback) {
    
	$.ajax({
	    url: sub, 
		dataType:'json',
		type: 'POST',
		data: data,
		success: function() {
			
					callback;  

					window.location.href = '/posts/' + previous;
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
			<EditCommentForm onSubmit={this.handleCSubmit} user = {this.state.users}/>
			<hr/>
			<EditCommentViews user = {this.state.users} comments = {this.state.comment}/>
			

			
            <hr/>
            
            
            
            </div>
            )
          }
});





var EditCommentForm = React.createClass({

     handleSubmit : function(e) {
       e.preventDefault();
       
       var body   = React.findDOMNode(this.refs.body).value.trim();
      
       if(!body) {
		  
          return;
       }
       this.props.onSubmit({body:body});
       
       React.findDOMNode(this.refs.body).value = '';
       
       },
    render: function() {
       return (
	   <div>
         <form className="postForm" onSubmit={this.handleSubmit}>
		 <div class="form-group">
			<label>Enter body here</label>
			<div id = "ck">
            <textarea id = "ckedit3" className = "form-control" placeholder="Say Something for post body.." ref="body"></textarea>
		    </div>
		</div>
            <button type = "submit" className = "btn btn-primary" value="Post">Submit!</button>
         </form>
		 </div>
   );
  }
 });

	var EditCommentViews = React.createClass ({

		render: function() {

    var j = " " + this.props.comments.body + " ";
    var comment = this.props.comments; 
	var cid = this.props.comments._id;
	console.log("CID: " + cid);
    var user = this.props.user;
	var uid = this.props.user._id;
	var userComments = this.props.user.comments;
    var upvoted = this.props.user.upvotedC;
	var downvoted = this.props.user.downvotedC;
	var self = this;

	if (upvoted != undefined) {
	  var style = {
        color: upvoted.indexOf(cid) > -1 ? 'rgb(0, 255, 0)' : 'rgb(64, 77, 91)'
      };

	  var style2 = {
	    color: downvoted.indexOf(cid) > -1 ? 'rgb(255, 0, 0)' : 'rgb(64, 77, 91)'
	  }
	  }
	 var tag = "#upvote" + comment._id;
	 var tag2 = "#downvote" + comment._id;
	 var tag3 = "#numbah" + comment._id;
	var tracker = comment.upvotes;
	
		 
		 if(upvoted!= undefined) {
		  var edit = {
	     display: userComments.indexOf(comment._id) > -1 ? '' : 'None'
	   }
	  }
	  else {
	  
	   var edit = {
	     display: 'None'
	  }
	  }
		 
			
		 
		  return(
			
			<div className = "userComments">
			
			<div id = {comment._id}>
			<div className = {"childs" + comment.nthNode} >
			
            <p><a href={"/user/" +comment.owner}><strong>{comment.author}</strong></a> <span id = {"numbah" + comment._id}>{comment.upvotes+" points"}</span> Posted on {comment.date} <a style = {{fontSize: 0.5 + "em"}}
			>(<span className = "glyphicon glyphicon-minus"></span>)</a></p>
			
			
			<div dangerouslySetInnerHTML={{__html : j }} />
		    <p><span style = {style} id = {"upvote" + comment._id} className = "glyphicon glyphicon-chevron-up" 
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
            $(tag3).text(tracker+ " points");
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
		console.log(tracker+ " points");
		$(tag3).text(tracker);
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

			
			
			></span>&nbsp;<a  role="button" data-toggle="collapse" href={"#collapseExample" + comment._id} aria-expanded="false" aria-controls="collapseExample">
  Reply
</a></p>
			<div className="collapse" id={"collapseExample" + comment._id}>
			<div id = "reply">
			<form   method = "post" id = "contactForm">
			<div className = "form-group">
			<input type="hidden" name="parentCommentId" value ={comment._id} />
			<textarea name = "body"></textarea>
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
    }
  });

React.render(<EditComment  />,
document.getElementById('editComments'));

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


$(document).ready(function () {
		AlloyEditor.editable('ckedit3', {
		
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