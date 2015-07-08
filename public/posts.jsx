﻿var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/posts/' + sub;
var click = 0;
var isIt = false;
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
                   if(data[i].upvotes < data[i+1].upvotes) {
                   var temp = data[i];
                   data[i] = data[i+1];
                   data[i+1] = temp;
                   }         
               }
             }
   
               
               console.log(data);
               this.setState({posts:data});
               this.setState({items:data});
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },

	 loadUserFromServer: function() {
        $.ajax({
            url: '/user',
            dataType: 'json',
            success: function(data) {
			   
               this.setState({user:data.local});
			   user = this.state.user;
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },


    getInitialState: function() {
       return {
          posts: [],
          items: [],
		  user:  []
       }
    },

    componentDidMount: function() {
    
        this.loadPostsFromServer();
		this.loadUserFromServer();
        //this.setState({items: this.state.posts});	
        //setInterval(this.loadPostsFromServer, this.props.pollInterval);
       
    },
   

 


    render: function() {
            return(
			<div>
            <div className = "PostFiller">
            
            <div className="form-group">
				<button for="collapseFive" className="btn btn-default" data-toggle="collapse" href="#collapseFive" aria-expanded="false" aria-controls="collapseFive">SEARCH!</button>
					<div id="collapseFive" className="collapse">
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
            
            <List7 user = {this.state.user} posts = {this.state.items} />
            </div>
           
           
			</div>
            )
          }
});




var List7 = React.createClass({ //has to be called list

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
	 
	 
	 var upvoted;
	 var downvoted;
	 var tag = "#upvote" + post._id;
	 var tag2 = "#downvote" + post._id;
	 var tag3 = "#numbah" + post._id;
	 
		       
		 return (
		 <div>
	 <div className = "inlinegroup"> 
         <div id = "upvote1" className = "inline"><span id = {"upvote" + post._id} className = "glyphicon glyphicon-menu-up" 
         onClick =
{function(event){

 
 $.ajax({
            url:  '/posts/' + post._id + '/upvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
			var color = $(tag).css('color');
			 if (color == "rgb(64, 77, 91)"){
			  $(tag).css('color', 'rgb(0, 255, 0)');
			   $(tag2).css('color', 'rgb(64, 77, 91)');
			  $(tag3).text(post.upvotes + 1);
			  console.log("Hit");
			  }
			  else {
			  console.log("Sup?");
			   $(tag).css('color', "rgb(64, 77, 91)");
			    $(tag3).text(post.upvotes);
			  }
              
              console.log("upvoted");
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
        
}
}
></span></div> <div className ="inline"><span id = {"numbah" + post._id}>{post.upvotes}</span> </div> <div className = "inline"><span id = {"downvote" + post._id}className = "glyphicon glyphicon-menu-down" 
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
             
			  var color = $(tag2).css('color');
			  //var color2 = $(tag1)
			 if ((color == "rgb(64, 77, 91)") && ($(tag2).css('color') == 'rgb(64, 77, 91)')){
			  console.log($(tag2).css('color'));
			  $(tag2).css('color', 'rgb(255, 0, 0)');
			  $(tag).css('color', 'rgb(64, 77, 91)');
			  $(tag3).text(post.upvotes - 1);
			  console.log("Hit");
			  }
			 
			  }
			  else {
			 
			   $(tag2).css('color', "rgb(64, 77, 91)");
			   $(tag3).text(post.upvotes + 1);
			  }
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
 		
 		
 
}
}


></span></div></div><li className ="inlinelist" key = {post._id}> <h4>{post.title}</h4>

         <p><a href = {'/posts/' + post._id} >{post.allComments} comments</a> Created By: {post.author} on: {new Date(post.date).toUTCString()} </p>
         
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
React.render(<PostFiller />,
document.getElementById('hot'));


function titleCompare(a, b) {
if( a.title  < b.title) return -1;
if (a.title  > b.title) return 1;
return 0;
}

function authorCompare(a, b) {
if( a.author < b.author) return -1;
if (a.author > b.author) return 1;
return 0;
}

function upvoteCompare(a,b) {
return a.upvotes - b.upvotes;
}
function dateCompare(a,b) {
if( a.date  < b.date) return -1;
if (a.date > b.date) return 1;
return 0;
}


