var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/k/' + sub;

var PostFiller = React.createClass({
  

    handlePostSubmit : function(data,callback) {
     $.ajax({
		
	    url: '/posts',
		dataType:'json',
		type: 'POST',
		data: data,
		success: function() {
					callback;  
					window.location.href = window.location.href;
					},
		error: function(xhr, status, err) {
		console.log("failed");
		console.error(this.props.url, status, err.toString());
		
		}.bind(this)
	});
   },


   getInitialState: function() {
       return {
          posts: [],
          
       }
    },


    render: function() {
            return(
			<div>
            <div className = "PostFiller">
            
            
            <div className = "Submit">
             <PostForm onPostSubmit={this.handlePostSubmit} />
            </div>
            </div>
           
            
           
           
			</div>
            )
          }
});





var PostForm = React.createClass({
    handleSubmit : function(e) {
       e.preventDefault();
       var title  = React.findDOMNode(this.refs.title).value.trim();
       var body   = React.findDOMNode(this.refs.body).value.trim();
      
       if(!title || !body) {
          return;
       }
       this.props.onPostSubmit({title:title, body:body});
       React.findDOMNode(this.refs.title).value = '';
       React.findDOMNode(this.refs.body).value = '';
       
       },
    render: function() {
       return (
         <form className="postForm" onSubmit={this.handleSubmit}>
		  <div class="form-group">
			<label>Thread Name</label>
            <input type = "text" className = "form-control" placeholder="Title..." ref="title"/>
         </div>
		 <div class="form-group">
			<label>Enter body here</label>
            <textarea id = "ckedit" className = "form-control" placeholder="Say Something for post body.." ref="body"></textarea>
		</div>
            <button type = "submit" className = "btn btn-primary" value="Post">Submit!</button>
         </form>
   );
  }
 });

//console.log(sub);
React.render(<PostFiller  pollInterval={postInterval}/>,
document.getElementById('createPosts'));

$(document).ready(function () {
		AlloyEditor.editable('ckedit', {
		uiNode: 'modal-4',
                toolbars: {

	add: {
        buttons: ['image', 'camera', 'hline', 'table'],
        tabIndex: 2
    },
        styles: {
            selections: [
                {
                    name: 'text',
                    buttons: [{
                        name: 'styles',
                        cfg: {
                            styles: [
                                {
                                    name: 'Head 1',
                                    style: { element: 'h1' }
                                },
                                {
                                    name: 'Head 2',
                                    style: { element: 'h2' }
                                },
                                {
                                    name: 'Big',
                                    style: { element: 'big' }
                                },
                                {
                                    name: 'Small',
                                    style: { element: 'small' }
                                },
				{
				    name: 'Formatted',
				    style: {element: 'pre'}
				},
                                {
                                    name: 'Code',
                                    style: { element: 'code' }
                                },
                               { name: 'Inline Quotation', style:{element: 'q'} }
                            ]
                        }
                    },'quote','bold', 'italic', 'underline', 'link', 'twitter','subscript','superscript', 'ul', 'ol'],
                    test: AlloyEditor.SelectionTest.text
                }
            ]
        }
    }




});
    
});
