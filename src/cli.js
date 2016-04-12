#!/usr/bin/env node

import parseArgs from 'minimist';
import render from './render';
import glob from 'glob';
import mkdirp from 'mkdirp';
import { resolve as _resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import pkg from '../package.json';

if (false) {
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
    );
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
}

/**
 * @class MarkmaidCLI
 */
class MarkmaidCLI {

  /**
   * @function parse
   * @param {Array} params
   * @param {Function} next
   */
  parse(params = [], next) {

    this.options = parseArgs(params);
    this.options.files = this.options._;
    this.options.outputDir = MarkmaidCLI.resolve(this.options['output-dir']);
    this.options.imageDir = MarkmaidCLI.resolve(this.options['image-dir'] || 'docs/img');

    return this;
  }

  /**
   * @function getHelpText
   */
  getHelpText() {
    const { info } = MarkmaidCLI;

    return [
      info('Usage: markmaid [options] <file|pattern>'),
      '',
      'file   The markdown document to render',
      '',
      'Options:',
      '  -o, --output-dir     Root directory for compiled markdown files',
      '  -i, --image-dir      Root directory for rendered image files',
      '  --version            Print version and quit',
    ].join('\n');
  }

  /**
   * @function resolve
   * @param {String} path
   */
  static resolve(path = '') {
    return _resolve(process.cwd(), path);
  }

  /**
   * @function info
   * @param {Str} str
   */
  static info(str) {
    return chalk.blue.bold(str);
  }

  /**
   * @function static version
   */
  static version() {
    return pkg.version;
  }

  /**
   * @function static lookupFiles
   * @param {Array|String} files
   * @param {Object} options
   */
  static lookupFiles(files, options) {
    let filenames;

    if (!Array.isArray(files)) {
      try {
        filenames = glob.sync(files, Object.assign({
          ignore: [`node_modules/${files}`],
        }, options));

        if (!filenames || !filenames.length) {
          throw new Error();
        }
      }
      catch (err) {
        filenames = [files];
      }
    }
    else {
      filenames = files;
    }

    return filenames;
  }
}

const cli = new MarkmaidCLI();

export {
  cli as default,
  MarkmaidCLI,
};
