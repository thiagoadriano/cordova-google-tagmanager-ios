const path = require('path');
const {
  generateLog,
  createPromise,
} = require('../helper/util');
const { mkDir } = require('../helper/io');

const log = generateLog('(create container)');
const { promise, resolve } = createPromise();

function createFolderContainer(pathContainer) {
  if (mkDir(pathContainer)) {
    log('Created container folder!');
  } else {
    log('Container folder already created!');
  }
}

function run(iosFolder) {
  const containerConfigPath = path.join(iosFolder, 'container');

  log('Creating the container folder...');
  createFolderContainer(containerConfigPath);

  log('Successfully added container in iOS project!', 'success');
  resolve();
}

function Main(context) {
  log('Running create cointainer', 'start');
  const { opts } = context;
  const root = opts.projectRoot;
  const iosFolder = path.join(root, 'platforms/ios/');

  log(`Folder containing your iOS project: ${iosFolder}`);
  run(iosFolder);

  return promise;
}

module.exports = Main;
