const fs = require('fs');
const path = require('path');
const xcode = require('xcode');
const { log, createPromise } = require('../helper/util');

const { promise, resolve } = createPromise();

function getFolderProj(listFolder = [], iosFolder) {
  for (let i = 0, len = listFolder.length; i < len; i += 1) {
    if (listFolder[i].match(/\.xcodeproj$/)) {
      log('IOS project found!', 'info');
      return path.join(iosFolder, listFolder[i]);
    }
  }
  log('IOS project not found!', 'error');
  return '';
}

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

function writeFileProject(projectPath, fileData) {
  try {
    fs.writeFileSync(projectPath, fileData);
    log('Project file rewritten!', 'info');
  } catch (error) {
    log(error, 'error');
  }
}

function createFolderContainer(pathContainer) {
  try {
    fs.mkdirSync(pathContainer);
    log('Created container folder!', 'info');
  } catch (error) {
    if (error.code === 'EEXIST') {
      log('Container folder already created!', 'info');
    } else {
      log(error, 'error');
    }
  }
}

function syncFolderContainer(pathContainer, pbxProject) {
  const pbxGroupKey = pbxProject.findPBXGroupKey({ name: 'CustomTemplate' });
  const resourceFile = pbxProject.addResourceFile(pathContainer, {}, pbxGroupKey);

  if (resourceFile) {
    log('Successfully synced container folder to project!', 'info');
  } else {
    log('container already synchronized with the project!', 'info');
  }
}

function run(opts, iosFolder, data) {
  const projectFolder = getFolderProj(data, iosFolder);
  const projectPath = path.join(projectFolder, 'project.pbxproj');
  const pbxProject = getPbxProject(opts, projectPath);
  const containerConfigPath = path.join(iosFolder, 'container');

  log('Creating the container folder...', 'info');
  createFolderContainer(containerConfigPath);

  log(`Parsing existing project at location: ${projectPath}`, 'info');
  syncFolderContainer(containerConfigPath, pbxProject);

  log('Writing the modified project back to disk ...', 'info');
  writeFileProject(projectPath, pbxProject.writeSync());

  log('Successfully added Google Tag Manager configuration container in iOS project!', 'success');
  resolve();
}

function Main(context) {
  log('Running create cointainer and sync project.', 'start');
  const { opts } = context;
  const root = opts.projectRoot;
  const iosFolder = path.join(root, 'platforms/ios/');

  log(`Folder containing your iOS project: ${iosFolder}`, 'info');

  fs.readdir(iosFolder, (err, data) => {
    if (err) {
      log(err, 'error');
    }
    run(opts, iosFolder, data);
  });

  return promise;
}

module.exports = Main;
