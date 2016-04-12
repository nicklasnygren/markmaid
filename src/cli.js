import chalk from 'chalk';
import glob from 'glob';
import mkdirp from 'mkdirp';
import parseArgs from 'minimist';
import pkg from '../package.json';
import render from './render';
import { readFileSync, writeFileSync } from 'fs';
import { resolve as _resolve } from 'path';

/**
 * @class MarkmaidCLI
 */
class MarkmaidCLI {

  /**
   * @function parse
   * @param {Array} params
   * @param {Function} next
   */
  parse(params = [], next = Function.prototype) {
    this.options = parseArgs(params);
    this.options.files = MarkmaidCLI.lookupFiles(this.options._);

    this.options.outputDir = MarkmaidCLI.resolve(this.options['output-dir']);
    this.options.imageDir = MarkmaidCLI.resolve(this.options['image-dir'] || 'docs/img');

    this.err = null;
    this.message = null;

    if (!this.options.files || this.options.help) {
      next(null, this.getHelpText());
    }
    else if (this.options.version) {
      next(null, MarkmaidCLI.version());
    }
    else {
      next(null, null, this.options);
    }

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

    try {
      filenames = [].concat(...files.map(f => glob.sync(f, Object.assign({
        ignore: [`node_modules/${files}`],
      }, options))));

      if (!filenames || !filenames.length) {
        throw new Error();
      }
    }
    catch (err) {
      filenames = files;
    }

    if (!Array.isArray(filenames)) {
      filenames = [filenames];
    }

    return filenames;
  }

  /**
   * @function process
   * @param {Array} files
   * @param {Object} options
   *
   * TODO: Move to lib to make markmaid usable programmatically
   */
  process(files, options) {
    const { resolve } = MarkmaidCLI;
    const { outputDir, imageDir } = options;

    return Promise.all(files.map(filename => {
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

const cli = new MarkmaidCLI();

export {
  cli as default,
  MarkmaidCLI,
};
