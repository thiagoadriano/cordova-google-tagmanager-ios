const { exec } = require('child_process');
const path = require('path');
const {
  createPromise,
  generateLog,
} = require('../helper/util');
const {
  exists,
  readFile,
  writeFile,
} = require('../helper/io');

const log = generateLog('(uninstall)');
const {
  promise,
  resolve,
  reject,
} = createPromise();
const LIB_TAG_MANAGER = 'GoogleTagManager';
let isNotLib = false;

function removeLib(contentPod) {
  const index = contentPod.findIndex((row) => row.trim().includes(LIB_TAG_MANAGER));

  if (index) {
    contentPod.splice(index, 1);
    log(`The library ${LIB_TAG_MANAGER} removed the Podfile.`);
  } else {
    log(`Not find index the library ${LIB_TAG_MANAGER}.`);
  }

  return contentPod;
}

function removeTagInPodFile(content) {
  log('Editable content Podfile...');
  let contentPod = content.split('\n');

  log('Find lib in podfile...');
  const hasLibInFile = contentPod.find((row) => row.trim().includes(LIB_TAG_MANAGER));

  if (!hasLibInFile) {
    log(`The library ${LIB_TAG_MANAGER} not has in Podfile.`);
    isNotLib = true;
  } else {
    isNotLib = false;
    contentPod = removeLib(contentPod);
  }
  return Buffer.from(contentPod.join('\n'));
}

function rewritePodFile(podPath) {
  log('Read Podfile...');
  const contentPod = readFile(podPath);
  const podEditable = removeTagInPodFile(contentPod.toString());
  if (!isNotLib) {
    log('Write Podfile...');
    writeFile(podPath, podEditable);
  } else {
    log('Finished without uninstalling the library.', 'success');
    resolve();
  }
}

function resultTerminalCommand(err, terminalData) {
  if (err) {
    log(`Error in execute pod in terminal: ${err}`, 'error');
    reject();
  } else {
    log(terminalData);
    log(`${LIB_TAG_MANAGER} removed in project with success!`, 'success');
    resolve();
  }
}

function uninstall(projectRoot) {
  if (!isNotLib) {
    log('Uninstall package and dependecies...');
    exec('pod install', { cwd: projectRoot }, resultTerminalCommand);
  }
}

function Main(context) {
  log(`Init process uninstall lib ${LIB_TAG_MANAGER}`, 'start');
  const projectRoot = path.join(context.opts.projectRoot, 'platforms/ios');
  const podFilePath = path.join(projectRoot, 'Podfile');

  if (!exists(projectRoot)) {
    log('Root project not find!', 'success');
    resolve();
  } else {
    log(`Root project in: ${projectRoot}`);

    if (exists(podFilePath)) {
      log(`Podfile find in: ${podFilePath}`);
      rewritePodFile(podFilePath);
      uninstall(projectRoot);
    } else {
      log('Podfile not find', 'success');
      resolve();
    }
  }

  return promise;
}

module.exports = Main;
