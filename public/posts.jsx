var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/posts/' + sub;
var click = 0;

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
   
               
               
               this.setState({posts:data});
               this.setState({items:data});
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
        this.setState({items: this.state.posts});	
        //setInterval(this.loadPostsFromServer, this.props.pollInterval);
       
    },
   

 


    render: function() {
            return(
			<div>
            <div className = "PostFiller">
            
            <div className="form-group">
				<button for="collapseFive" className="btn btn-default" data-toggle="collapse" href="#collapseFive" aria-expanded="false" aria-controls="collapseFive">SEARCH!</button>
					<div id="collapseFive" className="collapse">
					
						<input type="text" placeholder="Search by Author!" className = "form-control form-control-inline"  onChange ={this.authorList}	/>
					
						<input type="text" placeholder="Search by Title!" className = "form-control form-control-inline"  onChange ={this.titleList}/>
						<input type="text" placeholder="Search by Date!"  className = "form-control form-control-inline" onChange ={this.dateList}/>
						<input type="text" placeholder="Search by Upvotes!" className = "form-control form-control-inline"  onChange ={this.upvotesList}/>
							
					</div>

           </div> 
            </div>
           
            <hr/>
            <div className = "Posts">
            
            <List posts = {this.state.items} />
            </div>
           
           
			</div>
            )
          }
});

var ListItem = React.createClass({
    getInitialState: function() {
        return {
            isSelected: false
        };
    },
    handleClick: function() {
        this.setState({
            isSelected: true
        })
    },
    render: function() {
        var isSelected = this.state.isSelected;
        var style = {
            'background-color': ''
        };
        if (isSelected) {
            style = {
                'background-color': '#ccc'
            };
        }
        return (
            <li onClick={this.handleClick} style={style}>{this.props.content}</li>
        );
    }
});


var List = React.createClass({ //has to be called list
    hello : function() {
    	alert("hello");
    },
    render: function() {
    var blue =  {
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
         <div id = "upvote1" className = "inline"><span id = "upvote1" className = "glyphicon glyphicon-menu-up" 
         onClick =
{function(event){

 
 $.ajax({
            url:  '/posts/' + post._id + '/upvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              alert("hello");
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


