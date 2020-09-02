function sequencialExec(fn, parameter, listFn, resolve) {
  fn(parameter).then(() => {
    const fnExec = listFn.shift();
    if (fnExec) {
      sequencialExec(fnExec, parameter, listFn, resolve);
    } else {
      resolve();
    }
  });
}

function logger(logString, type = 'info', fileExecution = '') {
  const PROJ = '#GoogleTagManager »';
  const postfix = '\x1b[0m';
  let prefix = '';
  let icon = '';

  switch (type) {
    case 'error':
      icon = '✗ ';
      prefix = '\x1b[1m\x1b[31m'; // bold, red
      throw new Error(`${PROJ} ${prefix} ${logString} ${postfix}`); // reset
    case 'start':
      icon = '∝ ';
      prefix = '\x1b[0m\x1b[40m\x1b[33m'; // bgBlack, fgYellow
      break;
    case 'success':
      icon = '✔ ';
      prefix = '\x1b[40m\x1b[32m'; // bgBlack, fgGreen
      break;
    case 'info':
    default:
      icon = '⊷ ';
      prefix = '\x1b[40m\x1b[36m'; // bgBlack, fgCyan
      break;
  }
  if (!fileExecution) {
    icon = '';
  }
  console.log(`${PROJ} ${fileExecution} ${prefix}${icon}${logString} ${postfix}`);
}

function generateLog(prefixInfo = '') {
  return (logString, type) => logger(logString, type, prefixInfo);
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

function createSequencial(listFn, parameter) {
  const { promise, resolve } = createPromise();
  sequencialExec(listFn.shift(), parameter, listFn, resolve);
  return promise;
}

function getFolderXcodeProj(listFolder = []) {
  for (let i = 0, len = listFolder.length; i < len; i += 1) {
    if (listFolder[i].match(/\.xcodeproj$/)) {
      return listFolder[i];
    }
  }
  return null;
}

module.exports = {
  generateLog,
  createPromise,
  logger,
  createSequencial,
  getFolderXcodeProj,
};
