var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];



var ProfileFiller = React.createClass({

   getUser : function() {

   $.ajax({
            url: '/profile/' + sub,
            dataType: 'json',
            success: function(data) {
               this.setState({user:data.local});
               console.log(data.local);
               

            }.bind(this),
        error: function(xhr, status, err) {
                console.log("error");
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });

   },

   getProfilePosts: function(){
    $.ajax({
            url: '/userPosts/' + sub,
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
               this.setState({post: data});
               console.log(data);
               

            }.bind(this),
        error: function(xhr, status, err) {
                console.log("error");
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
   },

   getCommentPosts : function() {
    $.ajax({
            url: '/userComments/' + sub,
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
               this.setState({post: data});
               console.log(data);
               

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
          comments: []     
       }
    },


  componentDidMount: function() {
    this.getUser();
    this.getProfilePosts();
    this.getCommentPosts();

    //setInterval(this.getProfilePosts, 1000);
    //setInterval(this.getCommentPosts, 1000);
    },
  render : function() {
  return(
  <div>
  <hr/>
  <List user = {this.state.user} posts ={this.state.post} comments = {this.state.comments}/>
  </div>
  )
  
  }
});


var List = React.createClass({
  
  render : function() {
    
    
  return (
  <div className = "profile">
  
  <div className="panel panel-success">
   <div className="panel-heading">{this.props.user.email}&#39;s Profile</div>
  <div className="panel-body">
    <h3>{this.props.user.firstName} {this.props.user.lastName} is a {this.props.user.title} </h3>

    <p> I GOT DIS MUCH Karma : {this.props.user.karma }</p>
    <p> Upvotes : {this.props.user.upvotes} </p>
   

<div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div className="panel panel-primary">
    <div className="panel-heading" role="tab" id="headingOne">
      <h4 className="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          Posts
        </a>
      </h4>
    </div>
    <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
      <div className="panel-body">
       <table className="table table-hover">
    <thead>
<tr>
<th>Post Title</th> <th>Date</th> <th>Upvotes</th> <th>Number of Comments</th> <th>View Post</th>  
</tr>
</thead>
<tbody>
{
 this.props.posts.map(function(post){

  return (
   <tr>
   <td>{post.title}</td> <td>{post.date}</td> <td>{post.upvotes}</td> <td>{post.comments.length}</td> <td><a href ={"/posts/"+post._id}>View Post here</a></td>
    </tr>
  
  
  )})}
</tbody>
  
    </table>
      </div>
    </div>
  </div>
  <div className="panel panel-primary">
    <div className="panel-heading" role="tab" id="headingTwo">
      <h4 className="panel-title">
        <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
          Comments
        </a>
      </h4>
    </div>
    <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div className="panel-body">
        <table className="table table-hover">
    <thead>
<tr>
<th>Comment</th> <th>Date</th> <th>Upvotes</th> <th>Comment Thread</th> 
</tr>
</thead>
<tbody>
{
 this.props.comments.map(function(comment){

  return (
   <tr>
   <td>{comment.body}</td> <td>{comment.date}</td> <td>{comment.upvotes}</td> <td><a href ={"/posts/"+comment.post}>View Post here</a></td>
    </tr>
  
  
  )})}
 </tbody>
 </table>
      </div>
    </div>
  </div>
  
</div>


  </div>
  </div>
  </div>
  )
  }
});



React.render(<ProfileFiller   />,
document.getElementById('profileView'));