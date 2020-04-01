
'use strict';

const childprocess = require('child_process');
const spawn = childprocess.spawn;

const http = require('http');
const fs = require('fs');

// claat is a wrapper around the claat tool.
//
//   cwd - codelabs content dir
//   cmd - claat command, either 'update' or 'export'
//   auth - auth token to use
//   fmt - output format, e.g. 'html'
//   args - an array of source doc IDs or codelab names (IDs)
//   callback - an async task callback function
// Based on: https://github.com/googlecodelabs/tools/blob/master/site/tasks/helpers/claat.js
exports.run = (cwd, cmd, auth, fmt, args, callback) => {
  if (auth){
    args.unshift(cmd, '-auth', auth, '-f', fmt);
  } else {
    args.unshift(cmd, '-f', fmt);
  }
  const proc = spawn('claat', args, {cwd: cwd, env: process.env });
  
  // Get process stdout
  let output = '';

  proc.stderr.on('data', (data) => {
    //Here is where the output goes
    console.log('stderr: ' + data);
    data = data.toString();
    output += data;
  });
  
  // Handle error
  proc.on('close', async (e) => {
    if (e) {
      throw new Error(e);
    }
    await callback(output);
    });
  
};