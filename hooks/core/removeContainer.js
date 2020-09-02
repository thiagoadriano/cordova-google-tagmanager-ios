const path = require('path');
const {
  generateLog,
  createPromise,
} = require('../helper/util');
const {
  exists,
  removeDirAndFiles,
} = require('../helper/io');

const log = generateLog('(remove container)');
const { promise, resolve } = createPromise();

function run(iosFolder) {
  const containerConfigPath = path.join(iosFolder, 'container');

  log('Removing the container folder...');
  if (removeDirAndFiles(containerConfigPath)) {
    log('Successfully removed container!', 'success');
  } else {
    log('Folder not removed.', 'success');
  }

  resolve();
}

function Main(context) {
  log('Running remove container the project.', 'start');
  const { opts } = context;
  const root = opts.projectRoot;
  const iosFolder = path.join(root, 'platforms/ios/');

  if (exists(iosFolder)) {
    log(`Exists container iOS project: ${iosFolder}`);
    run(iosFolder);
  } else {
    log('Not exists container iOS project.', 'success');
    resolve();
  }

  return promise;
}

module.exports = Main;
