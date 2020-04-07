Codelabs Builder without auth
========================

This app is a building block for claat codelabs

## Getting set up
You will need in the deployment environment `claat` installed and the request made to the app need to be for documents with access from the claat tool (to ensure claat will be able to work you first need to run the claat export command with an id of a document (inside the drive of the google account you will be using to store the source docs of the codelabs) from the terminal/cmd and follow the steps to set up the token authentication).

After that run the application (will start in the port set in the `.env` file):
```
npm install

npm start
```

## View the Code
On the back-end,
- the app starts at `server.js`
- frameworks and packages are in `package.json`
- app secrets are safely stored in `.env`

On the front-end,
- edit `index.html`
- drag in `assets`, like images or music, to add them to your project

## Based on:

* [Claat tool](https://github.com/googlecodelabs/tools/blob/master/site/tasks/helpers/claat.js) - Google (Marc Cohen)
* [SpreedSheet to JSON](https://glitch.com/edit/#!/spreadsheet) - Made by Glitch (Jessica Lord & Jenn Schiffer)