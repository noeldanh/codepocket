const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
		password_confirmation: {type:String, required:true},
		// username: {type: String, required: true, minlength: 4, maxlength: 16},
		email: {
			type:String,
			required: [true, "You must enter an email"],
			unique: true
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			maxlength: 32,
			validate: {
				validator: function( value ) {
					return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test( value );
				},
				message: "Password failed validation, you must have at least 1 number, uppercase and special character"
	        }
		},
    }, { timestamps:true });

UserSchema.pre('save',  function(next) {
	if(this.password != this.password_confirmation){
		// This line will create an error message that matches the format of our other error messages
		this.invalidate('password', "Password and Password Confirmation must match");
		// In order for our pre-save method to fail we must pass an err into next()
		let err = new Error("Password and password confirmation do not match");
		next(err);
	}else{
		// remove password_confirmation so we're not storing it
		this.password_confirmation = '';
		this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
		next();
	}
})

mongoose.model('User', UserSchema);