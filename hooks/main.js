const createFolder = require('./core/createContainer');
const copyFile = require('./core/copyFile');
const installLib = require('./core/install');
const { createPromise, generateLog } = require('./helper/util');

const log = generateLog();
const { promise, resolve } = createPromise();
const executions = [createFolder, copyFile, installLib];

function sequencial(fn, context) {
  fn(context).then(() => {
    const fnExec = executions.shift();
    if (fnExec) {
      sequencial(fnExec, context);
    } else {
      resolve();
    }
  });
}

function Main(context) {
  if (context.opts.platforms.includes('ios')) {
    log('Running execution configuration GTM', 'start');
    sequencial(executions.shift(), context);
  } else {
    log('Not was sync folder and file GTM. Platform is not IOS.');
    resolve();
  }
  return promise;
}

module.exports = Main;
