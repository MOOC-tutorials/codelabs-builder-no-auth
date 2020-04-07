const url = require('url');
const {getGoogleDriveDocWithoutCode} = require('./google-utils');
const {commitBuild} = require('./github-utils.js');


module.exports = (app) => {
  // webhook route
  app.post('/', (req, res) => {
    const {body} = req;
    console.log(body);
    res.redirect('/index');
  });

  // index route
  app.get('/', (req, res) => {
    res.redirect('/index');
  });

  // Handle build of codelab, docId
  app.get('/index',
    (req, res) => {
        const queryParams = url.parse(req.url, true).query
        if (Object.keys(queryParams).length > 0) {
          // If they submit a url, get the data
          if (queryParams.key){
              const matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(queryParams.key);
              if (matches) {
                const key = matches[1];
                getGoogleDriveDocWithoutCode(key, async (output) => {
                  const baseDir = output.split('\t').pop();
                  try{
                    await commitBuild(baseDir);
                    console.log('/codelabs/' + baseDir + '/index.html');
                    res.redirect('/codelabs/' + baseDir + '/index.html');
                    //res.sendFile(__dirname + '/views/success.html');
                  } catch(err){
                    console.log(err);
                    res.sendFile(__dirname + '/views/error.html');
                  }
                });
              } else {
                res.sendFile(__dirname + '/views/error.html');
              }
          }
        } else{
            // If there is no key load the success page
            res.sendFile(__dirname + '/views/index.html');
        }
      }
    );
};