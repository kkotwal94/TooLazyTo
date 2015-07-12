var UpdateProfile = React.createClass({
loadUserFromServer : function() {
	$.ajax({
		url: '/user',
		//type: 'GET',
		dataType: 'json',
		success: function(data) {
			console.log(data);
			this.setState({users: data.local});
			
			
		}.bind(this),
		error: function(xhr, status, err) {
		 console.error(this.props.url, status, err.toString());
		}.bind(this)
	});
},


getInitialState: function() {
    return {
	 
	  users: [],
	  
	};
},

componentDidMount: function() {
       
		this.loadUserFromServer();
	
    },
handlePSubmit : function(data,callback) {
    
	$.ajax({
	    url: '/updateProfile',
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
   render: function() {
            
            return(
                  
            <div>
			
			
            <hr/>
			<UserView users = {this.state.users}/>
			<div className = "button-space">
			<button  role="button" data-toggle="collapse" href="#collapseExample" aria-expanded="true" aria-controls="collapseExample">
  Update!
</button>
			</div>
			<div id ="collapseExample" className = "collapse">
			<hr/>
			<UpdateForm onSubmit={this.handlePSubmit} user = {this.state.users}/>


			

			</div>
            <hr/>
            
            
            
            </div>
            )
          }
});





var UpdateForm = React.createClass({

    handleSubmit : function(e) {
	  e.preventDefault();
	var firstName   = React.findDOMNode(this.refs.firstName).value.trim();
	var lastName  = React.findDOMNode(this.refs.lastName).value.trim();
	var dob  = React.findDOMNode(this.refs.dob).value.trim();
	var schoolYear  = React.findDOMNode(this.refs.schoolYear).value.trim();
	
	
    
	
	this.props.onSubmit({firstName : firstName, lastName : lastName, dob: dob, schoolYear: schoolYear});
	
		React.findDOMNode(this.refs.firstName).value = '';
		React.findDOMNode(this.refs.lastName).value = '';
		React.findDOMNode(this.refs.dob).value = '';
		React.findDOMNode(this.refs.schoolYear).value = '';
		
	},
    
	render: function() {

	return(
		<form className="form-horizontal" onSubmit={this.handleSubmit}>
		
<span className="input input--juro">
					<input className="input__field input__field--juro" type="text" id="input-28" ref ="firstName" />
					<label className="input__label input__label--juro" for="input-28">
						<span className="input__label-content input__label-content--juro">{'Firstname: '+ this.props.user.firstName}</span>
					</label>
				</span>


		<span className="input input--juro">
					<input className="input__field input__field--juro" type="text" id="input-28" ref ="lastName" />
					<label className="input__label input__label--juro" for="input-28">
						<span className="input__label-content input__label-content--juro">{'Lastname: ' + this.props.user.lastName}</span>
					</label>
				</span>
				<span className="input input--juro">
					<input className="input__field input__field--juro" type="text" id="input-28" ref ="dob" />
					<label className="input__label input__label--juro" for="input-28">
						<span className="input__label-content input__label-content--juro">{'DOB: '+ this.props.user.dob}</span>
					</label>
				</span>
				<span className="input input--juro">
					<input className="input__field input__field--juro" type="text" id="input-28" ref ="schoolYear" />
					<label className="input__label input__label--juro" for="input-28">
						<span className="input__label-content input__label-content--juro">{'schoolYear: ' + this.props.user.schoolYear}</span>
					</label>
				</span>
		
		<div class="form-group">
		<label className="col-sm-0 control-label"></label>
		<div class="col-sm-5">
		<input type = "submit" value="Save Changes" className = "btn btn-primary" />
		</div>
		</div>
		</form>
);
}
});

	var UserView = React.createClass ({

		render: function() {

			
						return(
						<div>
						<ul className = "list-unstyled">
						<li>First Name : {this.props.users.firstName}</li>
						<li>Last Name : {this.props.users.lastName}</li>
						<li>DOB : {this.props.users.dob}</li>
						<li>School Year : {this.props.users.schoolYear}</li>
						<li>Upvotes : {this.props.users.upvotes}</li>
						<li>Karma : {this.props.users.karma}</li>
						</ul>
						</div>
							)

				
		}
	});
React.render(<UpdateProfile  />,
document.getElementById('editProfile'));

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


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