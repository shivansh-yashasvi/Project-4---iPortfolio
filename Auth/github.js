const GithubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: '/auth/github/callback',
		},
		function (accessToken, refreshToken, params, profile, cb) {
			// To keep the example simple, the user's GitHub profile is returned to
			// represent the logged-in user.  In a typical application, you would want
			// to associate the GitHub account with a user record in your database,
			// and return that user instead.
			console.log(profile._json.login);
			return cb(null, profile);
		}
	)
);
