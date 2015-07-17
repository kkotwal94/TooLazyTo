var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/posts/' + sub;
var click = 0;
var upvotedP;
var downvotedP;
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
   
               
              for (var x = 0; x < data.length; x++) {
                  var currentTime = new Date();
              		
                  var date = new Date(data[x].date);
              	 
                  if(currentTime.getFullYear() - date.getFullYear() < 1) {
                    if (currentTime.getMonth() - date.getMonth() < 1) {
                      if(currentTime.getDate() - date.getDate() < 1) {
                        if(currentTime.getHours() - date.getHours() < 1){
                          if(currentTime.getMinutes() - date.getMinutes() < 1){
                            if(currentTime.getSeconds() - date.getSeconds() <1) {

                            }
                            else {
                              data[x].date = currentTime.getSeconds() - date.getSeconds() + " seconds ago";
                            }
                        }
                          else {
                            var time = (currentTime.getMinutes() - date.getMinutes());
                            if (time == 1) {
                              var str = " minute ago";
                            }
                            else {
                              var str = " minutes ago";
                            }
                            data[x].date = time + str;
                          }
                      }
                        else {
                         var time = (currentTime.getHours() - date.getHours());
                            if (time == 1) {
                              var str = " hour ago";
                            }
                            else {
                              var str = " hours ago";
                            }
                            data[x].date = time + str;
                         
                        }
                      }
                      else {
                        var time = (currentTime.getDate() - date.getDate());
                            if (time == 1) {
                              var str = " day ago";
                            }
                            else {
                              var str = " days ago";
                            }
                            data[x].date = time + str;
                      }
                    }
                    else {
                      var time = (currentTime.getMonth() - date.getMonth());
                            if (time == 1) {
                              var str = " month ago";
                            }
                            else {
                              var str = " months ago";
                            }
                            data[x].date = time + str;
                    }
                  }

                  else {
                    var time = (currentTime.getFullYear() - date.getFullYear());
                            if (time == 1) {
                              var str = " year ago";
                            }
                            else {
                              var str = " years ago";
                            }
                            data[x].date = time + str;
                  }
                }





               this.setState({posts:data, items:data});
               
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
			   
               this.setState({user:data.local, uid:data});
			   upvotedP = this.state.user.upvotedP;
			   downvotedP = this.state.user.downvotedP;
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
		  user:  [],
		  uid: []
       }
    },

    componentDidMount: function() {
    
        this.loadPostsFromServer();
		this.loadUserFromServer();
        
       
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
					<input className="input__field input__field--hoshi" type="text" id="input-5" onChange = {this.titleList}/>
					<label className="input__label input__label--hoshi input__label--hoshi-color-1" for="input-5">
						<span className="input__label-content input__label-content--hoshi">Search by Title!</span>
					</label>
					</span>
						<span className="input input--hoshi">
					<input className="input__field input__field--hoshi" type="text" id="input-6" onChange = {this.dateList}/>
					<label className="input__label input__label--hoshi input__label--hoshi-color-1" for="input-6">
						<span className="input__label-content input__label-content--hoshi">Search by Date!</span>
					</label>
					</span>
						<span className="input input--hoshi">
					<input className="input__field input__field--hoshi" type="text" id="input-7" onChange = {this.upvotesList}/>
					<label className="input__label input__label--hoshi input__label--hoshi-color-1" for="input-7">
						<span className="input__label-content input__label-content--hoshi">Search by Upvotes!</span>
					</label>
					</span>
							
					</div>

           </div> 
            </div>
           
            <hr/>
            <div className = "Posts">
            
            <List7 user = {this.state.user} posts = {this.state.items} uid = {this.state.uid} />
            </div>
           
           
			</div>
            )
          }
});




var List7 = React.createClass({ //has to be called list
	

    render: function() {
	
	var usey = this.props.user;
	var uid = this.props.uid._id;
  var uids = '/user/' + uid;
    var upvoted = this.props.user.upvotedP;
	var downvoted = this.props.user.downvotedP;
	var myposts = this.props.user.posts;
	var self = this;
	
	
	 
  
    return(
	<div>
	
	
    <ul className = "list-unstyled">
    {
     this.props.posts.map(function(post) {
	 
	 console.log(upvoted);
	 
	 console.log(uid);
	 if (upvoted != undefined) {
	  var style = {
        color: upvoted.indexOf(post._id) > -1 ? 'rgb(0, 255, 0)' : 'rgb(64, 77, 91)'
      };

	  var style2 = {
	    color: downvoted.indexOf(post._id) > -1 ? 'rgb(255, 0, 0)' : 'rgb(64, 77, 91)'
	  }
	  var edit = {
	     display: myposts.indexOf(post._id) > -1 ? '' : 'None',
	     fontSize: '10px'
	   }
	  }
	  else {
	  
	   var edit = {
	     display: 'None'
	  }
	  }
	 
	 
	 var tag = "#upvote" + post._id;
	 var tag2 = "#downvote" + post._id;
	 var tag3 = "#numbah" + post._id;
	  var tag4 = "#upvote2" + post._id;
	 var tag5 = "#downvote2" + post._id;
	 var tag6 = "#numbah2" + post._id;
	  var tag7 = "#upvote3" + post._id;
	 var tag8 = "#downvote3" + post._id;
	 var tag9 = "#numbah3" + post._id;
	  var tag10 = "#upvote4" + post._id;
	 var tag11 = "#downvote4" + post._id;
	 var tag12 = "#numbah4" + post._id;
	 var tag13 = "#upvote5" + post._id;
	 var tag14 = "#downvote5" + post._id;
	  var tag15 = "#numbah5" + post._id;

	var tracker = post.upvotes;
	 
		
	
		       
		 return (
		 <div>
		
	 <div className = "inlinegroup"> 
         <div id = "upvote1" className = "inline"><span  style = {style} id = {"upvote" + post._id} className = "glyphicon glyphicon-menu-up" 
         onClick =
{function(event){

 
 $.ajax({
            url:  '/posts/' + post._id + '/upvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
			var color = $(tag).css('color');
            var color2 = $(tag2).css('color');
			var color4 = $(tag4).css('color');
			var color5 = $(tag5).css('color');
			var color7 = $(tag7).css('color');
			var color8 = $(tag8).css('color');
			var color10 = $(tag10).css('color');
			var color11 = $(tag11).css('color');
			var color13 = $(tag13).css('color');
			var color14 = $(tag14).css('color');
			
			
			
			console.log(tracker);
			 console.log("HEH: " + upvotedP);
      

	   if (color == "rgb(64, 77, 91)"){
		  
          if (color2 == "rgb(255, 0, 0)"){
		  
		    var x = parseInt($(tag3).text());
		    tracker = x;
           
		    $(tag).css('color', 'rgb(0, 255, 0)');
            $(tag2).css('color', 'rgb(64, 77, 91)');

			 $(tag4).css('color', 'rgb(0, 255, 0)');
            $(tag5).css('color', 'rgb(64, 77, 91)');
			 
			 $(tag7).css('color', 'rgb(0, 255, 0)');
            $(tag8).css('color', 'rgb(64, 77, 91)');

			 $(tag10).css('color', 'rgb(0, 255, 0)');
            $(tag11).css('color', 'rgb(64, 77, 91)');

			 $(tag13).css('color', 'rgb(0, 255, 0)');
            $(tag14).css('color', 'rgb(64, 77, 91)');

			tracker = tracker + 2;
            $(tag3).text(tracker);
			$(tag6).text(tracker);
			$(tag9).text(tracker);
			$(tag12).text(tracker);
			$(tag15).text(tracker);
            console.log("Hits");
			
			console.log(tracker);
            $.ajax({
            url:  '/posts/' + post._id + '/downvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              console.log("We got the downvote nulled");


          }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
          } 

          else {
		  console.log("NOW CHECK THIS OUT: " +$(tag3).text());
		  var x = parseInt($(tag3).text());
		  tracker = x;
		  
			  $(tag).css('color', 'rgb(0, 255, 0)');
			  $(tag2).css('color', 'rgb(64, 77, 91)');

			  $(tag4).css('color', 'rgb(0, 255, 0)');
			  $(tag5).css('color', 'rgb(64, 77, 91)');

			  $(tag7).css('color', 'rgb(0, 255, 0)');
			  $(tag8).css('color', 'rgb(64, 77, 91)');

			  $(tag10).css('color', 'rgb(0, 255, 0)');
			  $(tag11).css('color', 'rgb(64, 77, 91)');

			  $(tag13).css('color', 'rgb(0, 255, 0)');
			  $(tag14).css('color', 'rgb(64, 77, 91)');
			   tracker = tracker + 1;
			   console.log("CHECK THIS OUT: " + tracker);
			$(tag3).text(tracker);
			$(tag6).text(tracker);
			$(tag9).text(tracker);
			$(tag12).text(tracker);
			$(tag15).text(tracker);
			  
			  console.log("Hit");
			  
			  }
      }
       
       
			 
        else {
			  console.log("Sup?");
			   var x = parseInt($(tag3).text());
		       tracker = x;

			   $(tag).css('color', "rgb(64, 77, 91)");
			   $(tag4).css('color', "rgb(64, 77, 91)");
			   $(tag7).css('color', "rgb(64, 77, 91)");
			   $(tag10).css('color', "rgb(64, 77, 91)");
			   $(tag13).css('color', "rgb(64, 77, 91)");
         console.log(color2);
		 tracker = tracker - 1;
		 console.log(tracker);
			   $(tag3).text(tracker);
			$(tag6).text(tracker);
			$(tag9).text(tracker);
			$(tag12).text(tracker);
			$(tag15).text(tracker);
				
			  }
              
              console.log("upvoted");
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
        
}
}
></span></div> <div className ="inline"><span id = {"numbah" + post._id}>{post.upvotes}</span> </div> <div className = "inline"><span id = {"downvote" + post._id} style = {style2}className = "glyphicon glyphicon-menu-down" 
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
			var color = $(tag).css('color');
            var color2 = $(tag2).css('color');
			var color4 = $(tag4).css('color');
			var color5 = $(tag5).css('color');
			var color7 = $(tag7).css('color');
			var color8 = $(tag8).css('color');
			var color10 = $(tag10).css('color');
			var color11 = $(tag11).css('color');
			var color13 = $(tag13).css('color');
			var color14 = $(tag14).css('color');
        console.log(color);
        console.log(color2);
		
			 if (color2 == "rgb(64, 77, 91)"){
          if (color == "rgb(0, 255, 0)"){

            var x = parseInt($(tag3).text());
		       tracker = x;

            $(tag2).css('color', 'rgb(255, 0, 0)');
            $(tag).css('color', 'rgb(64, 77, 91)');

			 $(tag5).css('color', 'rgb(255, 0, 0)');
            $(tag4).css('color', 'rgb(64, 77, 91)');

			 $(tag8).css('color', 'rgb(255, 0, 0)');
            $(tag7).css('color', 'rgb(64, 77, 91)');

			 $(tag11).css('color', 'rgb(255, 0, 0)');
            $(tag10).css('color', 'rgb(64, 77, 91)');

			 $(tag14).css('color', 'rgb(255, 0, 0)');
            $(tag13).css('color', 'rgb(64, 77, 91)');


            tracker = tracker - 2;
			$(tag3).text(tracker);
			$(tag6).text(tracker);
			$(tag9).text(tracker);
			$(tag12).text(tracker);
			$(tag15).text(tracker);
			console.log(tracker);
            console.log("Hits");

            $.ajax({
            url:  '/posts/' + post._id + '/upvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              console.log("We got the upvote nulled");


          }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
          }

          else {

		  var x = parseInt($(tag3).text());
		       tracker = x;
        $(tag).css('color', 'rgb(64, 77, 91)');
         $(tag2).css('color', 'rgb(255, 0, 0)');
		 
		 $(tag4).css('color', 'rgb(64, 77, 91)');
         $(tag5).css('color', 'rgb(255, 0, 0)');
		
		$(tag7).css('color', 'rgb(64, 77, 91)');
         $(tag8).css('color', 'rgb(255, 0, 0)');
		 
		 $(tag10).css('color', 'rgb(64, 77, 91)');
         $(tag11).css('color', 'rgb(255, 0, 0)');
		 
		 $(tag13).css('color', 'rgb(64, 77, 91)');
         $(tag14).css('color', 'rgb(255, 0, 0)');        
		tracker = tracker - 1;
		console.log(tracker);
		$(tag3).text(tracker);
			$(tag6).text(tracker);
			$(tag9).text(tracker);
			$(tag12).text(tracker);
			$(tag15).text(tracker);
        console.log("Hit");
        }
      }

			  else {
			 var x = parseInt($(tag3).text());
		       tracker = x;
			   $(tag2).css('color', "rgb(64, 77, 91)");
			    $(tag5).css('color', "rgb(64, 77, 91)");
				 $(tag8).css('color', "rgb(64, 77, 91)");
				  $(tag11).css('color', "rgb(64, 77, 91)");
				  $(tag14).css('color', "rgb(64, 77, 91)");
				 
			   tracker = tracker + 1;
				console.log(tracker);
			   $(tag3).text(tracker);
			$(tag6).text(tracker);
			$(tag9).text(tracker);
			$(tag12).text(tracker);
			$(tag15).text(tracker);

			  }
			  
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
 		
 		
 
}
}


></span></div></div><li className ="inlinelist" key = {post._id}> <h4>{post.title}</h4>

         <p><a href = {'/posts/' + post._id} >{post.allComments} comments</a> Created By: <a href = {uids}>{post.author}</a> <span><em>{post.date}</em></span> <a className = "tryingtohide" href = {"/edit/" +uid +"/"+post._id} id = {"edit" + post._id} style = {edit}>Edit</a> &nbsp;
         <a className = "tryingtohide"  id = {"delete" + post._id} style = {edit} onClick = 
         {function(event) {
          var x = confirm("Are you sure you want to delete this post?");
          if(x == true) {
            
            $.ajax({
            url:  '/posts/delete/' +uid+"/"+ post._id ,
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              console.log("We got post deleted?");


          }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
          
            window.location.href = window.location.href;

          }

          else {
            alert("Guess we wont then");
          }
         }}

          >Delete</a>
         </p>
         
          </li>
</div>
         )
     })
    }
   </ul>
   </div>
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

(function() {
        // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
        if (!String.prototype.trim) {
          (function() {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
              return this.replace(rtrim, '');
            };
          })();
        }

        [].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
          // in case the input is already filled..
          if( inputEl.value.trim() !== '' ) {
            classie.add( inputEl.parentNode, 'input--filled' );
          }

          // events:
          inputEl.addEventListener( 'focus', onInputFocus );
          inputEl.addEventListener( 'blur', onInputBlur );
        } );

        function onInputFocus( ev ) {
          classie.add( ev.target.parentNode, 'input--filled' );
        }

        function onInputBlur( ev ) {
          if( ev.target.value.trim() === '' ) {
            classie.remove( ev.target.parentNode, 'input--filled' );
          }
        }
      })();