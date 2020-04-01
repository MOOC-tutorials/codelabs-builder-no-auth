const claat = require('./claat.js');

exports.getGoogleDriveDocWithoutCode = async (docId, callback) => {
  claat.run('codelabs', 'export', null, 'html', [docId], callback);
};