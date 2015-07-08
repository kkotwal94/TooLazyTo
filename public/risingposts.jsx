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
                   if(data[i].allComments < data[i+1].allComments) {
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
        <button for="collapseThree" className="btn btn-default" data-toggle="collapse" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">SEARCH!</button>
          <div id="collapseThree" className="collapse">
          <span className="input input--hoshi">
          <input className="input__field input__field--hoshi" type="text" id="input-4" onChange = {this.authorList}/>
          <label className="input__label input__label--hoshi input__label--hoshi-color-1" for="input-4">
            <span className="input__label-content input__label-content--hoshi">Search by Author!</span>
          </label>
          </span>
            
            <span className="input input--hoshi">
          <input className="input__field input__field--hoshi" type="text" id="input-4" onChange = {this.titleList}/>
          <label className="input__label input__label--hoshi input__label--hoshi-color-1" for="input-4">
            <span className="input__label-content input__label-content--hoshi">Search by Title!</span>
          </label>
          </span>
            <span className="input input--hoshi">
          <input className="input__field input__field--hoshi" type="text" id="input-4" onChange = {this.dateList}/>
          <label className="input__label input__label--hoshi input__label--hoshi-color-1" for="input-4">
            <span className="input__label-content input__label-content--hoshi">Search by Date!</span>
          </label>
          </span>
            <span className="input input--hoshi">
          <input className="input__field input__field--hoshi" type="text" id="input-4" onChange = {this.upvotesList}/>
          <label className="input__label input__label--hoshi input__label--hoshi-color-1" for="input-4">
            <span className="input__label-content input__label-content--hoshi">Search by Upvotes!</span>
          </label>
          </span>
              
          </div>

           </div>
            
            </div>
           
            <hr/>
            <div className = "Posts">
            
            <List2 posts = {this.state.items}/>
            </div>
           
           
			</div>
            )
          }
});


var List2 = React.createClass({ //has to be called list
    
    render: function() {
  

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

         <p><a href = {'/posts/' + post._id} >{post.allComments} comments</a> Created By: {post.author} on: {new Date(post.date).toUTCString()}</p>
         
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
document.getElementById('rising'));
