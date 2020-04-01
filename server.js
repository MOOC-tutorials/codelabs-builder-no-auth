// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const directory = require('serve-index');

// cookies are used to save authentication
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

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
