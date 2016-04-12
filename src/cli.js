#!/usr/bin/env node

import parseArgs from 'minimist';
import render from './render';
import glob from 'glob';
import mkdirp from 'mkdirp';
import { resolve as _resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';

const root = process.cwd();
const resolve = path => _resolve(root, path);
const options = parseArgs(process.argv.slice(2));
const [ pattern ] = options._;
const info = chalk.blue.bold;

if (!pattern || options.help) {
  console.log(
`
${info('Usage: markmaid [options] <files|pattern>...')}

File      The mermaid-powered markdown files to be rendered
Pattern   String of file pattern to render. Handles ** globs.

Options:
  --output-dir      Output root for compiled .md files
  --image-dir       Output root for saved .png files
`
  )
}

else {
  const imageDir = resolve(options['image-dir'] || 'docs/img');
  mkdirp.sync(imageDir); 

  let outputDir;
  if (options['output-dir']) {
    outputDir = resolve(options['output-dir']);
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
  
  Promise.all(filenames.map(filename => {
      let path = filename.split('/');
      const [ baseName, ext ] = path.pop().split('.');
      const writePath = resolve(outputDir);
      path = resolve(path.join('/'));
    
      return render(readFileSync(resolve(filename), 'utf-8'), imageDir)
        .then(parsed => {
          const filePath = `${writePath}/${baseName}.md`;
          writeFileSync(filePath, parsed.markdown)
          return [filePath, ...parsed.images];
        });
    }))
    .then(res => {
      const files = Array.prototype.concat.apply([], res);
      process.stdout.write(files.join('\n'));
      process.exit();
    });
}
