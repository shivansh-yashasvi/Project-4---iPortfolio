const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		function (accessToken, refreshToken, profile, cb) {
			console.log(profile._json.name);
			return cb(null, profile);
		}
	)
);
