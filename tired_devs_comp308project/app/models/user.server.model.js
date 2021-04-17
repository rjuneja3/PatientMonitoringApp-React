const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Schema = mongoose.Schema;

var UserSchema = new Schema({

  firstName: {
    type: String,
    required: "Firstname is required"
  },
  lastName:{
    type: String,
    required: "Lastname is required"
  },
  username: {
    type: String,
    unique: true,
    // Validate 'email' value existance
    required: "Email is required",

    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    // Validate the 'password' value length
    validate: [
      (password) => password && password.length > 6,
      "Password should be longer",
    ],
  },
  address: {
    type: String,
    required: "Address is required",
  },
  phoneNumber: {
    type: String,
    required: "Phone Number is required",
  },
  role: {
    type: String,
    default: "user",
    enum: ["patient", "nurse", "user"]
  }
},
  {timestamps: true}
);

// Set the 'fullname' virtual property
UserSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	const splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

// pre-save middleware to handle the hashing of your users‘ passwords
UserSchema.pre('save', function(next){
	//hash the password before saving it
	this.password = bcrypt.hashSync(this.password, saltRounds);
	next();
});

UserSchema.methods.validatePassword= function(plainPassword, hashPassword){
  return bcrypt.compare(plainPassword, hashPassword);
};

// Create an instance method for authenticating user
UserSchema.methods.authenticate = function(password) {
	//compare the hashed password of the database 
	//with the hashed version of the password the user enters
	return this.password === bcrypt.hashSync(password, saltRounds);
};


UserSchema.statics.findUniqueUsername = function (username, suffix, callback) { // find an available unique username for new users
	var _this = this;
	var possibleUsername = username + (suffix || '');
	_this.findOne({
		username: possibleUsername
	}, function (err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};


// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});


mongoose.model('User', UserSchema);
