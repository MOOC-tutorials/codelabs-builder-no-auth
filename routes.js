const url = require('url');
const {getGoogleDriveDocWithoutCode} = require('./google-utils');
const {commitBuild} = require('./github-utils.js');


module.exports = (app) => {
  // index route
  app.get('/', (req, res) => {
    res.redirect('/index');
  });

  // Handle build of codelab, docId
  app.get('/index',
    (req, res) => {
        const key = url.parse(req.url, true).query
        if (Object.keys(key).length > 0) {
          // If they submit a key, get the data
          if (key.key){
              getGoogleDriveDocWithoutCode(key.key, async (output) => {
                const baseDir = output.split('\t').pop();
                await commitBuild(baseDir);
                res.redirect('codelabs/' + baseDir + '/index.html');
                //res.sendFile(__dirname + '/views/success.html');
            });            
          }
        } else{
            // If there is no key, but a code exists load the success page
            res.sendFile(__dirname + '/views/index.html');
        }
      }
    );
};