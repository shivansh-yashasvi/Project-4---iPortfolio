const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProSchema = new Schema({
	Name: {
		type: String, // String is shorthand for {type: String}
	},
	email: {
		type: String, // String is shorthand for {type: String}
	},
});
const Profile = mongoose.model('Profile', ProSchema);
module.exports = Profile;
