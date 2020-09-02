const path = require('path');
const xcode = require('xcode');
const {
  generateLog,
  createPromise,
  getFolderXcodeProj,
} = require('../helper/util');
const {
  readDir,
  writeFile,
  exists,
} = require('../helper/io');

const log = generateLog('(unsync container)');
const { promise, resolve } = createPromise();

function getPbxProject(opts, projectPath) {
  let proj = null;

  if (!opts.cordova.project) {
    proj = xcode.project(projectPath);
    proj.parseSync();
  } else {
    proj = opts.cordova.project.parseProjectFile(opts.projectRoot).xcode;
  }

  return proj;
}

function unsyncFolderContainer(pathContainer, pbxProject) {
  const pbxGroupKey = pbxProject.findPBXGroupKey({ name: 'CustomTemplate' });
  const resourceFile = pbxProject.removeResourceFile(pathContainer, {}, pbxGroupKey);

  if (resourceFile) {
    log('Successfully unsynced container folder to project!');
  } else {
    log('container already unsynchronized with the project!');
  }
}

function run(opts, iosFolder, data) {
  const projectFolder = path.join(iosFolder, getFolderXcodeProj(data));
  const projectPath = path.join(projectFolder, 'project.pbxproj');
  const pbxProject = getPbxProject(opts, projectPath);
  const containerConfigPath = path.join(iosFolder, 'container');

  log(`Parsing existing project at location: ${projectPath}`);
  unsyncFolderContainer(containerConfigPath, pbxProject);

  log('Writing the modified project back to disk ...');
  if (writeFile(projectPath, pbxProject.writeSync())) {
    log('Project file rewritten!');
  } else {
    log('Project file not rewritten!');
  }

  log('Successfully removed configuration container in iOS project!', 'success');
  resolve();
}

function Main(context) {
  log('Running unsync container in project.', 'start');
  const { opts } = context;
  const root = opts.projectRoot;
  const iosFolder = path.join(root, 'platforms/ios/');

  if (exists(iosFolder)) {
    log(`Folder find in iOS project: ${iosFolder}`);

    const files = readDir(iosFolder);
    run(opts, iosFolder, files);
  } else {
    log('Folder project root not find', 'success');
    resolve();
  }

  return promise;
}

module.exports = Main;
