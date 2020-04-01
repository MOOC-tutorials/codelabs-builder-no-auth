// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const directory = require('serve-index');
const expressSession = require('express-session');

// cookies are used to save authentication
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({secret:'codelabs-builder-asdafsdc)#=aARI)30',
                        resave: true,
                        saveUninitialized: true,
                        maxAge: (90 * 24 * 3600000) }));

// Public route
app.use(express.static('public'))
app.use('/codelabs', directory(__dirname + '/codelabs'));
app.use('/codelabs', express.static(__dirname + '/codelabs'));

// Functional routes
require('./routes.js')(app);

// Listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
