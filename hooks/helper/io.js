const fs = require('fs');
const { logger } = require('./util');

function readDir(path) {
  try {
    return fs.readdirSync(path);
  } catch (err) {
    logger(`Error in read dir ${path}: ${err}`, 'error');
    return null;
  }
}

function exists(file) {
  try {
    return fs.existsSync(file);
  } catch (err) {
    logger(`Error in check if exists ${file}: ${err}`, 'error');
    return null;
  }
}

function writeFile(filePath, contentData) {
  try {
    fs.writeFileSync(filePath, contentData);
    return true;
  } catch (err) {
    logger(`Error in write file ${filePath}: ${err}`, 'error');
    return false;
  }
}

function readFile(file) {
  try {
    return fs.readFileSync(file);
  } catch (err) {
    logger(`Error in read file ${file}: ${err}`, 'error');
    return null;
  }
}

function mkDir(path) {
  try {
    fs.mkdirSync(path);
    return true;
  } catch (error) {
    if (error.code !== 'EEXIST') {
      logger(error, 'error');
    }
    return false;
  }
}

function removeDirAndFiles(path) {
  try {
    fs.rmdirSync(path, { recursive: true, maxRetries: 2, retryDelay: 150 });
    return true;
  } catch (error) {
    logger(error, 'error');
    return false;
  }
}

module.exports = {
  readDir,
  exists,
  writeFile,
  readFile,
  mkDir,
  removeDirAndFiles,
};
