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
                for(var j = 0; j < data.length; j++) { 
                for( var i = 0; i < data.length-1; i++) {
                   if(data[i].upvotes < data[i+1].upvotes) {
                   var temp = data[i];
                   data[i] = data[i+1];
                   data[i+1] = temp;
                   }         
               }
             }
                treeCycle(data, "Wow");
                data = finalData;
               console.log(data);
               
               this.setState({comments:data});
               
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
          
       }
    },

    componentDidMount: function() {
    this.getUser();
        this.getComments();
        
        
       
    },

    render: function() {
            return(
      <div>
            <div className = "Comment">
            
            <div className = "Submit">
			
			
             <CreateComment onCommentSubmit={this.handleCommentSubmit} />
            </div>
            
            <CommentList comments = {this.state.comments}/>
            </div>
           
            
           
           
      </div>
            )
          }
});


var CommentList = React.createClass({ //has to be called list
		
		 
		 
	
    render : function() {
      return( 
	
		  <div className = "total">
          <ul className = "list-unstyled">
		  {
          this.props.comments.map(function(comment) {
			
		 
			
		 
		  return(
			
			<div className = "userComments">
			
			<div id = {comment._id}>
			<div className = {"childs" + comment.nthNode} style = {{paddingLeft: 3*comment.nthNode + 'em'}}>
            <li><a href={"/user/" +comment.owner}><strong>{comment.author}</strong></a> {comment.upvotes+" points"} Posted on {comment.date} <a style = {{fontSize: 0.5 + "em"}}
			onClick = {function(event){
				//alert("hello");
		 var text = "#" + comment._id;
		 var texted = "#" + comment.pComment;
		 console.log(text);
		 
		 $(text).appendTo(texted);
				$(text).collapse();
			
			
			}}
			>(<span className = "glyphicon glyphicon-minus"></span>)</a></li>
			
			
			<li>{comment.body}</li>
			<li><span id = "upvote1" className = "glyphicon glyphicon-chevron-up"></span>&nbsp;<span id = "upvote1" className = "glyphicon glyphicon-chevron-down"></span>&nbsp;<a  role="button" data-toggle="collapse" href={"#collapseExample" + comment._id} aria-expanded="false" aria-controls="collapseExample">
  Reply
</a></li>
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

function treeCycle(data, str) {
    
   
    if(data.comments.length != 0)
    for(var x = 0; x < data.comments.length; x++)
    {
		str = str + " " + data.comments[x].pComment;
		
		data.comments[x].treeStruc = str;
        finalData.push(data.comments[x]);
        if(data.comments[x].comments.length != 0) {
           treeCycle(data.comments[x], str);
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

$('#contactForm').submit(function() {
alert("hit");
 return false;
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


function divAppend () {
var div1 = comment.pComment;
var div2 = comment._id;
div1.appendChild(div2);
}