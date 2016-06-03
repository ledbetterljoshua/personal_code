// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '554843974691930', // your App ID
        'clientSecret'  : '6c58daa2402f22b76261a7b8d9d7e5dc', // your App Secret
        'callbackURL'   : 'https://gentle-chamber-9551.herokuapp.com/auth/facebook/callback'
    }

};