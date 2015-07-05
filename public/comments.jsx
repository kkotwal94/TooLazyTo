var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/posts/' + sub + '/getPost/comments';
var name;
var href;
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
            
            <CommentList comments = {this.state.comments} users = {this.state.user} />
            </div>
           
            
           
           
      </div>
            )
          }
});


var CommentList = React.createClass({ //has to be called list
    render : function() {
      return( 
          <p>Hello</p>    
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
         <form className="postForm" onSubmit={this.handleSubmit}>
      <div class="form-group">
      <label>Comment</label>
            <textarea id = "ckedite" className = "form-control" placeholder="Comment here!!.." ref="body"></textarea>
    </div>
            <button type = "submit" className = "btn btn-primary" value="Post">Submit!</button>
         </form>
   );
  }
 });



//console.log(sub);
React.render(<CommentFiller />,
document.getElementById('comments'));

