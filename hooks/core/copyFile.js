const fs = require('fs');
const path = require('path');
const {
  createPromise,
  generateLog,
} = require('../helper/util');

const {
  exists,
  readDir,
} = require('../helper/io');

const log = generateLog('(copy file)');
const { promise, resolve } = createPromise();
const PATTERN_FILE = /^GTM-[A-Z]{6,8}\.json$/;

function writeFile(source, targetFilePath) {
  try {
    log('Reading the original file');
    const readSource = fs.createReadStream(source);

    log('Writing the copy in the container folder');
    readSource.pipe(fs.createWriteStream(targetFilePath));
  } catch (error) {
    log(`Error in copy file ${error}`, 'error');
  }
}

function isValidGTMNameFile(fileName) {
  return PATTERN_FILE.test(fileName);
}

function run(root, fileName) {
  const pathFile = path.join(root, fileName);
  const targetFolder = path.join(root, 'platforms/ios/container');
  const targetFilePath = path.join(targetFolder, fileName);

  if (!exists(pathFile)) {
    log(`File ${fileName} not found in ${root}`, 'error');
  }

  if (!exists(targetFilePath)) {
    writeFile(pathFile, targetFilePath);
    log('Successfully copied file GTM in container folder!', 'success');
  } else {
    log('File exists in container folder!', 'success');
  }
}

function searchGTMFile(root) {
  log('Find GTM file in root directory....');
  const files = readDir(root);
  return files.find((name) => isValidGTMNameFile(name));
}

function Main(context) {
  log('Running copy file GTM-xxxxxxx.json in root project to container folder', 'start');

  const root = context.opts.projectRoot;
  const fileName = searchGTMFile(root);

  if (fileName) {
    log(`File has find: ${fileName}`);
    run(root, fileName);
    resolve();
  } else {
    log('File GTM not found!', 'error');
  }

  return promise;
}

module.exports = Main;
