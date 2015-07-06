var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/posts/' + sub + '/getPost';
var name;
var href;
console.log(sub);

var PostFiller = React.createClass({
  

    
  
   getPost : function() {
      $.ajax({
            url: id,
            dataType: 'json',
            success: function(data) {
               
   
               
               this.setState({post:data});
               
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
          user: []
          
       }
    },

    componentDidMount: function() {
    this.getUser();
        this.getPost();
        
        //setInterval(this.loadPostsFromServer, this.props.pollInterval);
       
    },

    render: function() {
            return(
			<div>
            <div className = "CommentFiller">
            
            
            
            <List posts = {this.state.post} users = {this.state.user} />
            </div>
           
            
           
           
			</div>
            )
          }
});


var List = React.createClass({ //has to be called list
    
    render: function() {

    var j = " " + this.props.posts.body + " ";
    var post = this.props.posts; 
    var user = this.props.users;
    
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
          <div className = "panel panel-footer">
          <a href = {href}>View : {name}s profile</a> or <a>Give this user some Karma</a>
          </div>
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

