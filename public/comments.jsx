var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/posts/' + sub + '/getPost/comments';
var name;
var href;
var finalData = [];
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
                
                treeCycle(data);
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
          <ul className = "list-unstyled">
		  {
          this.props.comments.map(function(comment) {
		  return(
			<div className = "userComments">
			<div className = {"child" + comment.nthNode}>
            <li><a href={"/user/" +comment.owner}><strong>{comment.author}</strong></a> {comment.upvotes+" points"} Posted on {comment.date}</li>

			<li>{comment.body}</li>
			<li><span id = "upvote1" className = "glyphicon glyphicon-chevron-up"></span>&nbsp;<span id = "upvote1" className = "glyphicon glyphicon-chevron-down"></span>&nbsp;<a  role="button" data-toggle="collapse" href={"#collapseExample" + comment._id} aria-expanded="false" aria-controls="collapseExample">
  Reply
</a></li>
			<div className="collapse" id={"collapseExample" + comment._id}>
			<div id = "reply">
			<form   method = "post" id = "contactForm">
			<div className = "form-group">
			<input type="hidden" name="parentCommentId" value ={comment._id} />
			<textarea name = "body">Enter reply here</textarea>
			</div>
			 
			<button type = "submit" className = "btn btn-primary">
			Save</button>
			</form>
			</div>
			</div>
			</div>
			<hr/>
			</div>
			)
			})
			}
              </ul>
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