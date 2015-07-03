var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/k/' + sub;

var PostFiller = React.createClass({
  authorList : function(event){
var updatedList = this.state.posts;
updatedList = updatedList.filter(function(item){
  return item.author.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
});
this.setState({items: updatedList});
console.log(updatedList);
},

titleList : function(event){
var updatedList = this.state.posts;
updatedList = updatedList.filter(function(item){
  return item.title.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
});
this.setState({items: updatedList});
console.log(updatedList);
},

dateList : function(event){
var updatedList = this.state.posts;
updatedList = updatedList.filter(function(item){
  return item.date.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
});
this.setState({items: updatedList});
console.log(updatedList);
},

upvotesList : function(event){
var updatedList = this.state.posts;
updatedList = updatedList.filter(function(item){
  return item.upvotes.toString().search(event.target.value.toString()) !== -1;
});
this.setState({items: updatedList});
console.log(updatedList);
},

    loadPostsFromServer: function() {
        $.ajax({
            url: '/allPosts',
            dataType: 'json',
            success: function(data) {
               for(var j = 0; j < data.length; j++) { 
                for( var i = 0; i < data.length-1; i++) {
                   if(data[i].date < data[i+1].date) {
                   var temp = data[i];
                   data[i] = data[i+1];
                   data[i+1] = temp;
                   }         
               }
             }
   
               
               this.setState({items:data});
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
          items: []
       }
    },

    componentDidMount: function() {
    
        this.loadPostsFromServer();
        this.setState({items: this.state.posts})
        setInterval(this.loadPostsFromServer, this.props.pollInterval);
       
    },
   

 


    render: function() {
            return(
			<div>
            <div className = "PostFiller">
              <div className="form-group">
        <button for="collapseFour" className="btn btn-default" data-toggle="collapse" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">SEARCH!</button>
          <div id="collapseFour" className="collapse">
          
            <input type="text" placeholder="Search by Author!" className = "form-control form-control-inline" onChange ={this.authorList}/>
          
            <input type="text" placeholder="Search by Title!" className = "form-control form-control-inline" onChange ={this.titleList}/>
            <input type="text" placeholder="Search by Date!"  className = "form-control form-control-inline" onChange ={this.dateList}/>
            <input type="text" placeholder="Search by Upvotes!" className = "form-control form-control-inline" onChange ={this.upvotesList}/>
              
          </div>

           </div>
            
            </div>
           
            <hr/>
            <div className = "Posts">
            
            <List posts = {this.state.items}/>
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
         <div className = "inline"><span id = "upvote1" className = "glyphicon glyphicon-menu-up" 
         onClick =
{function(event){
  $("#upvote1").click(function(){
    $("#upvote1").css("color", "red");
});
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
></span></div> <div className ="inline">{post.upvotes} </div> <div className = "inline"><span className = "glyphicon glyphicon-menu-down" 
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
document.getElementById('newest'));
