const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// https://console.developers.google.com
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        }, 
        (accessToken, refreshToken, profile, done) => {
            // console.log('access token: ', accessToken);
            // console.log('refresh token: ', refreshToken);
            // console.log('profile', profile);
            //first search if user is already in database
            User.findOne({
                googleId: profile.id
            })
            .then((existingUser) => {
                if (existingUser) {
                    //if we already have a record w/ user profile ID
                    done(null, existingUser);
                } else {
                    //we don't have a user record w/ this ID, make new record
                    new User({
                        googleId: profile.id
                    }).save()
                    .then(user => done(null, user));
                }
            })
        }
    )
);