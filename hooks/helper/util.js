const fs = require('fs');

function logger(logString, type = 'info', fileExecution = '') {
  const PROJ = '#GoogleTagManager »';
  const postfix = '\x1b[0m';
  let prefix = '';

  switch (type) {
    case 'error':
      prefix = '\x1b[1m\x1b[31m ✗ '; // bold, red
      throw new Error(`${PROJ} ${prefix} ${logString} ${postfix}`); // reset
    case 'start':
      prefix = '\x1b[0m\x1b[40m\x1b[33m ∝ '; // bgBlack, fgYellow
      break;
    case 'success':
      prefix = '\x1b[40m\x1b[32m ✔ '; // bgBlack, fgGreen
      break;
    case 'info':
    default:
      prefix = '\x1b[40m\x1b[36m ⊷ '; // bgBlack, fgCyan
      break;
  }
  console.log(`${PROJ} ${fileExecution} ${prefix} ${logString} ${postfix}`);
}

function generateLog(prefixInfo = '') {
  return (logString, type) => logger(logString, type, prefixInfo);
}

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
  } catch (err) {
    logger(`Error in write file ${filePath}: ${err}`, 'error');
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

function createPromise() {
  const objPromise = {
    promise: null,
    resolve: null,
    reject: null,
  };

  objPromise.promise = new Promise((resolve, reject) => {
    objPromise.resolve = resolve;
    objPromise.reject = reject;
  });

  return objPromise;
}

module.exports = {
  generateLog,
  createPromise,
  exists,
  readFile,
  writeFile,
  readDir,
};
