const uninstallLib = require('./core/uninstall');
const removeContainer = require('./core/removeContainer');
const unsyncContainer = require('./core/unsyncContainer');
const {
  createPromise,
  generateLog,
  createSequencial,
} = require('./helper/util');

const log = generateLog();
const { promise, resolve } = createPromise();

async function Main(context) {
  if (context.opts.platforms.includes('ios')) {
    const executions = [removeContainer, unsyncContainer, uninstallLib];
    log('Running uninstall GTM', 'start');
    createSequencial(executions, context).then(resolve);
  } else {
    log('Platform is not IOS.');
    resolve();
  }
  return promise;
}

module.exports = Main;
