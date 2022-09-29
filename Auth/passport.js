const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const User = require('../models/proschema');
const jwt = require('jsonwebtoken');

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

const checkIfUserExists = async (profile, cb) => {
	console.log('here');
	const currentUser = await User.findOne({ email: profile._json.email });
	if (currentUser) {
		profile.jwt = jwt.sign(
			{ email: profile._json.email },
			process.env.TOKEN_SECRET
		);
		profile.isNew = false;
		
	} else {
		const newUser = new User({
			email: profile._json.email,
			name: profile._json.name,
		});
		newUser.save();
		profile.jwt = jwt.sign(
			{ email: profile._json.email },
			process.env.TOKEN_SECRET
		);
		profile.isNew = true;
	}
	return cb(null, profile);
};

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		function (accessToken, refreshToken, profile, cb) {
			checkIfUserExists(profile, cb);
		}
	)
);

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: '/auth/github/callback',
		},
		function (accessToken, refreshToken, profile, done) {
			checkIfUserExists(profile, done);
		}
	)
);
