function log(logString, type) {
  const PROJ = '[GoogleTagManagerForIos] »';
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

  console.log(`${PROJ} ${prefix} ${logString} ${postfix}`);
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

module.exports = { log, createPromise };
