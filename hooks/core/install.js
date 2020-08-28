const { exec } = require('child_process');
const path = require('path');
const {
  createPromise,
  generateLog,
  exists,
  readFile,
  writeFile,
} = require('../helper/util');

const log = generateLog('(install)');
const {
  promise,
  resolve,
  reject,
} = createPromise();
const LIB_TAG_MANAGER = 'GoogleTagManager';

function addLib(contentPod) {
  let position = 0;
  let index = contentPod.length - 1;

  while (index) {
    if (contentPod[index].trim() === 'end') {
      position = index;
      break;
    }
    index -= 1;
  }

  if (position) {
    contentPod.splice(position, 0, `\tpod '${LIB_TAG_MANAGER}'`);
    log(`The lib ${LIB_TAG_MANAGER} add Podfile in position: ${position}.`);
  } else {
    log(`The lib ${LIB_TAG_MANAGER} not add in Podfile.`);
  }

  return contentPod;
}

function addTagInPodFile(content) {
  log('Editable content Podfile...');

  let contentPod = content.split('\n');
  const hasLibInFile = contentPod.find((row) => row.trim().includes(LIB_TAG_MANAGER));

  if (hasLibInFile) {
    log(`The lib ${LIB_TAG_MANAGER} has in Podfile.`);
  } else {
    contentPod = addLib(contentPod);
  }
  return Buffer.from(contentPod.join('\n'));
}

function rewritePodFile(podPath) {
  log('Read Podfile...');
  const contentPod = readFile(podPath);
  const podEditable = addTagInPodFile(contentPod.toString());
  log('Write Podfile...');
  writeFile(podPath, podEditable);
}

function resultTerminalCommand(err, terminalData) {
  if (err) {
    log(`Error in execute pod in terminal: ${err}`, 'error');
    reject();
  } else {
    log(terminalData);
    log(`${LIB_TAG_MANAGER} add in project with success!`, 'success');
    resolve();
  }
}

function intall(projectRoot) {
  log('Install package and dependecies...');
  exec('pod install', { cwd: projectRoot }, resultTerminalCommand);
}

function Main(context) {
  log(`Init process instalation lib ${LIB_TAG_MANAGER}`, 'start');
  const projectRoot = path.join(context.opts.projectRoot, 'platforms/ios');
  const podFilePath = path.join(projectRoot, 'Podfile');

  if (!exists(projectRoot)) {
    log('Root project not find!', 'error');
  }

  log(`Root project in: ${projectRoot}`);

  if (exists(podFilePath)) {
    log(`Podfile find in: ${podFilePath}`);
    rewritePodFile(podFilePath);
    intall(projectRoot);
  } else {
    log('Podfile not find', 'error');
    reject();
  }

  return promise;
}

module.exports = Main;
