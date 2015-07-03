var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/posts/' + sub + '/getPost';
console.log(id);

var PostFiller = React.createClass({
  

    

   getPost : function() {
      $.ajax({
            url: id,
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
          post: [],
          
       }
    },

    componentDidMount: function() {
    
        this.getPost();
        
        //setInterval(this.loadPostsFromServer, this.props.pollInterval);
       
    },

    render: function() {
            return(
			<div>
            <div className = "CommentFiller">
            
            
            
            <List posts = {this.state.post} />
            </div>
           
            
           
           
			</div>
            )
          }
});


var List = React.createClass({ //has to be called list
    
    render: function() {
    var post = this.props.posts; 
    var j = " " + this.props.posts.body + " ";
    
    return(
    <ul className = "list-unstyled">
    {
    
         <div>
   <div className = "inlinegroup"> 
         <div id = "upvote1" className = "inline"><span id = "upvote1" className = "glyphicon glyphicon-menu-up" 
         onClick =
{function(event){

 
 $.ajax({
            url:  '/posts/' + post._id + '/upvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              
              console.log("upvoted");
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
        
}
}
></span></div> <div className ="inline">{post.upvotes} </div> <div className = "inline"><span className = "glyphicon glyphicon-menu-down" 
onClick =           
{function(event){
  
  var click = 0;
  click = click + 1;
console.log(post._id);
 $.ajax({
            url: '/posts/' + post._id + '/downvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              //console.log(data);
              console.log("downvote");
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    
    var counter = click %2;
    if(click % 2 != 0) {
      post.upvotes = post.upvotes + 1;

    }
 
}
}


></span></div></div><li className ="inlinelist" key = {post._id}> <h4>{post.title}</h4>

         <p><a href = {'/posts/' + post._id} >{post.__v} comments</a> Created By: {post.author} on: {new Date(post.date).toUTCString()}</p>
         
          </li>
          <div className = "panel panel-primary">
          <div className = "panel panel-heading">{post.title}</div>
          <div className = "panel panel-body">
          <div dangerouslySetInnerHTML={{__html : j }} />
          </div>
          <div className = "panel panel-footer"></div>
          </div>
</div>
         
     
    }
   </ul>


    )

    }
  
   });






//console.log(sub);
React.render(<PostFiller  pollInterval={postInterval}/>,
document.getElementById('createComments'));

