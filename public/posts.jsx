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
               for(var j = 0; j < data.posts.length; j++) { 
                for( var i = 0; i < data.posts.length-1; i++) {
                   if(data.posts[i].upvotes < data.posts[i+1].upvotes) {
                   var temp = data.posts[i];
                   data.posts[i] = data.posts[i+1];
                   data.posts[i+1] = temp;
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

    handlePostSubmit : function(post) {
     var post_s = this.state.posts;
     post_s.push(post);
     this.setState({post_s:post}, function() {
           //setState accepts a callback for us, to avoid race condition, we sen           //d the request after we set the new state
           $.ajax({
             url: '/posts',
             dataType: 'json',
             type: 'POST',
             data: post,
             success: function(data) {
               this.setState({post_s: data});
             }.bind(this),
             error: function(xhr, status, err) {
                console.error(this.props.urls, status, err.toString());
             }.bind(this)
      });
    });
   },

    getInitialState: function() {
       return {
          posts: [],
          title: []
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
            
            
            <div className = "Submit">
             <PostForm onPostSubmit={this.handlePostSubmit} />
            </div>
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
    var upvoted = "upvoted";
    var downvoted = "downvoted";
    return(
    <ul>
    {
     this.props.posts.map(function(post) {
         return (
         
         <li key = {post._id}><a href = {post.link}>{post.title}</a>
         <p><a href = {'/r/' + sub +'/'+ post._id} >{post.__v} comments</a> Upvotes : {post.upvotes} By: {post.author} Created on: {new Date(post.date).toUTCString()} <button onClick =
{function(event){
console.log(post._id);
 $.ajax({
            url: id + '/' + post._id + '/upvote',
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
}>+</button> <button onClick = 
{function(event){
console.log(post._id);
 $.ajax({
            url: id + '/' + post._id + '/downvote',
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
>-</button></p>
         <hr/>
          </li>

         )
     })
    }
   </ul>
    )
    }
   });


var PostForm = React.createClass({
    handleSubmit : function(e) {
       e.preventDefault();
       var title  = React.findDOMNode(this.refs.title).value.trim();
       var body   = React.findDOMNode(this.refs.body).value.trim();
       var link   = React.findDOMNode(this.refs.link).value.trim();
       if(!title || !link || !body) {
          return;
       }
       this.props.onPostSubmit({title:title, body:body, link:link});
       React.findDOMNode(this.refs.title).value = '';
       React.findDOMNode(this.refs.body).value = '';
       React.findDOMNode(this.refs.link).value = '';
       },
    render: function() {
       return (
         <form className="postForm" onSubmit={this.handleSubmit}>
            <input type = "text" placeholder="Say Something for post body.." ref="body"/>
            <input type = "text" placeholder="Title..." ref="title"/>
            <input type = "text" placeholder="Title link..Include ...https://" ref="link"/>
            <input type = "submit" value="Post" />
         </form>
   );
  }
 });

//console.log(sub);
React.render(<PostFiller  pollInterval={postInterval}/>,
document.getElementById('hot'));

function myFunction(post) {
  var str;
  for (var i = 0; i< post.length; i++) {
       str += post[i];
  }
}