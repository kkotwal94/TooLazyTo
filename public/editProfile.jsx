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
	 
	  users: []
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
					//window.location.href ="/";
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
			
			<UpdateForm onSubmit={this.handlePSubmit} user = {this.state.users}/>
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
		<div class="form-group">
		<label className="col-sm-0 control-label">First Name:</label>
		<div class="col-sm-5">
		<input type = "text" placeholder={this.props.user.firstName} ref = "firstName"/>
		</div>
		</div>
		<div class="form-group">
		<label className="col-sm-0 control-label">Last Name:</label>
		<div class="col-sm-5">
		<input type = "text" placeholder={this.props.user.lastName} ref = "lastName"/>
		</div>
		</div>
		<div class="form-group">
		<label className="col-sm-0 control-label">DoB:</label>
		<div class="col-sm-5">
		<input type = "text" placeholder={this.props.user.dob} ref = "dob"/>
		</div>
		</div>
		<div class="form-group">
		<label className="col-sm-0 control-label">What year are you?:</label>
		<div class="col-sm-5">
		<input type = "text" placeholder={this.props.user.schoolYear} ref = "schoolYear"/>
		</div>
		</div>
		
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
			return(<p>hi</p>)
		}
	});
React.render(<UpdateProfile  />,
document.getElementById('editProfile'));

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};