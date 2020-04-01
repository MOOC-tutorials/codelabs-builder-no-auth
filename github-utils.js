const { readFileSync, readdirSync } = require("fs");
const {basename} = require("path");

const { App } = require("@octokit/app");
const {Octokit} = require("@octokit/rest");

const APP_ID = process.env.APP_ID;
const PRIVATE_KEY = readFileSync(process.env.PRIVATE_KEY_FILE, "utf8");

const app = new App({ id: APP_ID, privateKey: PRIVATE_KEY });
const octokit = new Octokit({
 async auth() {
   const installationAccessToken = await app.getInstallationAccessToken({
     installationId: process.env.INSTALLATION_ID
   }).catch((err)=>console.log(err));
     // console.log(`token ${installationAccessToken}`);
     return `token ${installationAccessToken}`;
   }
});

// Commit constants
const REPO = process.env.REPO;
const OWNER = process.env.OWNER;
const BASE_PATH = process.env.BASE_PATH;
const BASE = process.env.BASE;
const BASE_REF = process.env.BASE_REF;

console.log(REPO, OWNER, BASE_PATH, BASE, BASE_REF);

const commitFile = async (path, fileContent, baseDir) => {
   console.log(path, OWNER, REPO, baseDir);
   const base_ref = await octokit.git.getRef({
     owner: OWNER,
     repo: REPO,
     ref: BASE_REF
   })
   const base_sha = base_ref.data.object.sha;
   await octokit.git.createRef({
     owner: OWNER,
     repo: REPO,
     ref: 'refs/heads/' + baseDir,
     sha: base_sha
   }).catch((err) => {
    console.log(err.errors);
    //Already a branch exists
  });

   const existingFile = await octokit.repos.getContents({
     owner: OWNER,
     repo: REPO,
     path,
     ref: baseDir
   }).catch(async (err) => {
     //console.log(err);
     const newFile = await octokit.repos.createOrUpdateFile(
     {owner: OWNER,
      repo: REPO,
      branch: baseDir,
      path,
      content: fileContent, 
      message: 'Update ' + path,
     }).catch((err) =>{
       console.log("Fail creation of file");
       console.log(err);
     });
     //return newFile;
   });
  if(existingFile){
    console.log(existingFile.data);
    return await octokit.repos.createOrUpdateFile(
     {owner: OWNER,
      repo: REPO,
      branch: baseDir,
      path,
      content: fileContent, 
      message: 'Update ' + path,
      sha: existingFile.data.sha});
  }
}

exports.commitBuild = async (baseDir) => {
  baseDir = baseDir.trim();
  console.log(baseDir);
  
  // index
  const indexPath = BASE_PATH + baseDir + '/index.html';
  const indexFile = new Buffer(readFileSync(__dirname+ '/' + indexPath)).toString('base64');
  const indexCommit = await commitFile(indexPath, indexFile, baseDir);
  console.log(indexPath);

  // codelabs.json
  const codelabsJsonPath = BASE_PATH + baseDir + '/codelab.json';
  const codelabsJsonFile = new Buffer(readFileSync(__dirname+ '/' + codelabsJsonPath)).toString('base64');;
  const codelabsJsonCommit = await commitFile(codelabsJsonPath, codelabsJsonFile, baseDir);
  console.log(codelabsJsonPath);

  // img
  const baseImgPath = __dirname + '/' + BASE_PATH + baseDir + '/img/';
  const images = readdirSync(baseImgPath);
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imgPath = BASE_PATH + baseDir + '/img/' + image;
    const imgFile = new Buffer(readFileSync(baseImgPath + image)).toString('base64');
    const imgCommit = await commitFile(imgPath, imgFile, baseDir);
    console.log(imgPath);
  }
  
  // Open pull request
  const pullRequest = await octokit.pulls.create({
    owner: OWNER,
    repo: REPO,
    title: 'Update codelab: ' + baseDir ,
    head: baseDir,
    base: BASE
  }).catch((err) => {
    console.log(err.errors);
    //Already a PR existis or no changes are detected between the branches (master vs staging)
    return {data: {}};
  });
  console.log(pullRequest.data.url);
};