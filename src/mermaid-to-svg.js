import { resolve, join } from 'path';
import JsSHA from 'jssha';
import { exec } from 'child_process';
import { writeFile } from 'fs';

const MERMAID_PATH = process.env.MERMAID_PATH || resolve(process.cwd(), 'node_modules', 'mermaid');
const PHANTOM_PATH = process.env.MERMAID_PATH || resolve(process.cwd(), 'node_modules', 'phantomjs', 'bin', 'phantomjs');
const CMD_PATH = join(MERMAID_PATH, 'bin', 'mermaid.js');
const DEFAULT_STYLE = resolve(__dirname, '..', 'src', 'default-style.css');
const IMG_PATH = resolve(__dirname, '..', 'testrun');
const TEMP_PATH = '/tmp';

function getImageFilename(hash, dir) {
 return `${dir || IMG_PATH}/${hash}.png`;
}

function getTempFile(hash) {
  return `${TEMP_PATH}/${hash}`;
}

function getHash(input) {
  const shaObj = new JsSHA('SHA-1', 'TEXT')
  shaObj.update(input);
  return shaObj.getHash('HEX');
}

function writeTempDefinitionFile(input) {
  return new Promise((resolve, reject) => {
    const hash = getHash(input);
    writeFile(getTempFile(hash), input, err => {
      if (err) {
        reject(err);
      }
      else {
        resolve(hash);
      }
    });
  });
}

function writeSvgFile(hash, dir) {
  return new Promise((resolve, reject) => {
    exec(
      `node ${CMD_PATH} -o ${dir || IMG_PATH} -t ${DEFAULT_STYLE} -w 1776 -e ${PHANTOM_PATH} ${getTempFile(hash)}`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(getImageFilename(hash, dir));
        }
      }
    );
  });
}

function createSvg(input, dir) {
  return writeTempDefinitionFile(input)
    .then(hash => writeSvgFile(hash, dir));
}

export {
  createSvg as default,
  getHash,
  getImageFilename,
};
