const fs = require('fs');
const path = require('path');
const { parseString } = require('xml2js');
const util = require('../helper/util');

const { log } = util;
const { promise, resolve } = util.createPromise();

function objReturnFind(bolFind, strValue) {
  return { isFind: bolFind, value: strValue };
}

function findValueVariable(variableName, listVariables) {
  if (Array.isArray(listVariables)) {
    const variableObj = listVariables.find((vrb) => vrb.$.name === variableName);
    if (variableObj) {
      return objReturnFind(true, variableObj.$.value);
    }
    return objReturnFind(false, 'Not found variable GTM_FILE_NAME in config.xml');
  }
  return objReturnFind(false, 'Not found list variables in config.xml');
}

function getValueNameFile(pluginName, listPlugins) {
  const plugin = listPlugins.find((plg) => plg.$.name === pluginName);
  if (plugin) {
    return findValueVariable('GTM_FILE_NAME', plugin.variable);
  }
  return objReturnFind(false, 'Plugin not found in config.xml');
}

function getFileName(pluginName, contents) {
  const { promise: prm, resolve: res, reject: rej } = util.createPromise();
  parseString(contents, (error, resultXml) => {
    if (error) {
      rej(error);
    } else {
      const result = getValueNameFile(pluginName, resultXml.widget.plugin);
      if (result.isFind) {
        res(result.value);
      } else {
        rej(result.value);
      }
    }
  });
  return prm;
}

function writeFile(source, targetFilePath) {
  try {
    log('Reading the original file', 'info');
    const readSource = fs.createReadStream(source);

    log('Writing the copy in the container folder', 'info');
    readSource.pipe(fs.createWriteStream(targetFilePath));
  } catch (error) {
    log(error, 'error');
  }
}

function isValidGTMNameFile(fileName) {
  log('Check if file name is correct GTM container pattern', 'info');
  const PATTERN_FILE = /^GTM-[A-Z]{6,}\.json$/;
  return PATTERN_FILE.test(fileName);
}

function readFile(filePath) {
  log('Read config.xml for find GTM file name', 'info');
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    log(error, 'error');
    return null;
  }
}

function run(root, fileName) {
  const hasPatternGtmFile = isValidGTMNameFile(fileName);
  const pathFile = path.join(root, fileName);
  const targetFolder = path.join(root, 'platforms/ios/container');
  const targetFilePath = path.join(targetFolder, fileName);

  if (!hasPatternGtmFile) {
    log(`File name: ${fileName} does not match the pattern GTM-XXXXXXX.json`, 'error');
  }

  if (!fs.existsSync(pathFile)) {
    log(`File ${fileName} not found in ${root}`, 'error');
  }

  if (!fs.existsSync(targetFilePath)) {
    writeFile(pathFile, targetFilePath);
    log('Successfully copied file GTM in container folder!', 'success');
  } else {
    log('File exists in container folder!', 'success');
  }
}

function Main(context) {
  log('Running copy file GTM-xxxxxxx.json to container folder...', 'start');

  const root = context.opts.projectRoot;
  const fileConfigPath = path.join(root, 'config.xml');
  const fileConfigContent = readFile(fileConfigPath);

  getFileName(context.opts.plugin.id, fileConfigContent)
    .then((fileName) => {
      run(root, fileName);
      resolve();
    })
    .catch((error) => log(error, 'error'));

  return promise;
}

module.exports = Main;
