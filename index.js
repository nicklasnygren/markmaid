import chalk from 'chalk';
import cli from './src/cli';

const error = chalk.bold.red;

cli.parse(process.argv.slice(2), (err, message, options) => {
  if (err) {
    console.error(
      error('\nYou had errors in your syntax. Use --help for further information.')
    );
    err.forEach(e => console.error(e.message));
    return;
  }
  else if (message) {
    console.log(message);
    return;
  }

  cli.process(options.files, options).then(process.exit);
});
