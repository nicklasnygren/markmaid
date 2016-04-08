import { resolve } from 'path';
import JsSHA from 'jssha';
import { exec } from 'child_process';
import { writeFile } from 'fs';

const TEMP_PATH = '/tmp';
const IMG_PATH = resolve(__dirname, '..', 'dist');

function getImageFilename(hash) {
 return `${IMG_PATH}/${hash}.png`;
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

function writeSvgFile(hash) {
  return new Promise((resolve, reject) => {
    exec(`mermaid ${getTempFile(hash)} -o ${IMG_PATH}`, (error, stdout, stderr) => {
      if (error) {
        reject(err);
      }
      else {
        resolve(getImageFilename(hash));
      }
    });
  });
}

function createSvg(input) {
  return writeTempDefinitionFile(input)
    .then(writeSvgFile);
}

export {
  createSvg as default,
  getHash,
  getImageFilename,
};
