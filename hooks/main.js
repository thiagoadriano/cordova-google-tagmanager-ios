const createFolder = require('./core/createContainer');
const copyFile = require('./core/copyFile');
const { createPromise, log } = require('./helper/util');

const { promise, resolve } = createPromise();

module.exports = (context) => {
  if (context.opts.platforms.includes('ios')) {
    log('Running execution configuration GTM', 'start');
    createFolder(context).then(() => {
      copyFile(context).then(resolve);
    });
  } else {
    log('Not was sync folder and file GTM. Platform is not IOS.', 'info');
    resolve();
  }
  return promise;
};
