const createFolder = require('./core/createContainer');
const copyFile = require('./core/copyFile');
const installLib = require('./core/install');
const syncContainer = require('./core/syncContainer');
const {
  createPromise,
  generateLog,
  createSequencial,
} = require('./helper/util');

const log = generateLog();
const { promise, resolve } = createPromise();

function Main(context) {
  if (context.opts.platforms.includes('ios')) {
    const exections = [createFolder, copyFile, syncContainer, installLib];
    log('Running execution configuration GTM', 'start');
    createSequencial(exections, context).then(resolve);
  } else {
    log('Not was sync folder and file GTM. Platform is not IOS.');
    resolve();
  }
  return promise;
}

module.exports = Main;
