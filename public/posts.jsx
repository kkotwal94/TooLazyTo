var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/k/' + sub;

var PostFiller = React.createClass({
  
    loadPostsFromServer: function() {
        $.ajax({
            url: '/allPosts',
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
   
               
               
               this.setState({posts:data});
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function() {
       return {
          posts: [],
       }
    },

    componentDidMount: function() {
    
        this.loadPostsFromServer();
        setInterval(this.loadPostsFromServer, this.props.pollInterval);
       
    },
   

 


    render: function() {
            return(
			<div>
            <div className = "PostFiller">
            
            
            </div>
           
            <hr/>
            <div className = "Posts">
            
            <List posts = {this.state.posts}/>
            </div>
           
           
			</div>
            )
          }
});


var List = React.createClass({ //has to be called list
    
    render: function() {
    var green =  {
      color: 'green'
    };
   
    var red = {
       color: 'red'
    };

    var upvoted = "upvoted";
    var downvoted = "downvoted";
    return(
    <ul className = "list-unstyled">
    {
     this.props.posts.map(function(post) {
         return (
         <div>
	 <div className = "inlinegroup"> 
         <div className = "inline"><span className = "glyphicon glyphicon-menu-up" style = {green} 
         onClick =
{function(event){
console.log(post._id);
 $.ajax({
            url:  '/posts/' + post._id + '/upvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              //console.log(data);
              console.log("upvoted");
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });

}
}
></span></div> <div className ="inline">{post.upvotes} </div> <div className = "inline"><span className = "glyphicon glyphicon-menu-down" style={red}
onClick =               
{function(event){
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

}
}


></span></div></div><li className ="inlinelist" key = {post._id}> <h4>{post.title}</h4>

         <p><a href = {'/' + post._id} >{post.__v} comments</a> Created By: {post.author} on: {new Date(post.date).toUTCString()}</p>
         
          </li>
</div>
         )
     })
    }
   </ul>
    )
    }
   });



//console.log(sub);
React.render(<PostFiller  pollInterval={postInterval}/>,
document.getElementById('hot'));

