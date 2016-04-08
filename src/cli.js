import parseArgs from 'minimist';
import replaceCodeBlocks from '.';
import glob from 'glob';
import mkdirp from 'mkdirp';
import { resolve as _resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const resolve = path => _resolve(root, path);
const root = process.cwd();
const options = parseArgs(process.argv.slice(2));
const [ pattern ] = options._;

const imageDir = resolve(options['image-dir'] || 'docs/img');
mkdirp.sync(imageDir); 

let outputDir = resolve(options['output-dir']);
if (outputDir) {
  mkdirp.sync(outputDir); 
}
else {
  outputDir = root;
}

let filenames;
try {
  filenames = glob.sync(pattern) ;
  if (!filenames || !filenames.length) {
    throw new Error();
  }
}
catch (err) {
  filenames = pattern;
}

filenames.forEach(filename => {
  let path = filename.split('/');
  const [ baseName, ext ] = path.pop().split('.');
  const writePath = resolve(outputDir);
  path = resolve(path.join('/'));

  replaceCodeBlocks(readFileSync(resolve(filename), 'utf-8'), imageDir)
    .then(newFileContent => writeFileSync(`${writePath}/${baseName}.md`, newFileContent));
});
