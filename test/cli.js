import test from 'tape';
import cli, { MarkmaidCLI } from '../src/cli';
import { resolve } from 'path';

test('CLI', assert => {

  assert.ok(new MarkmaidCLI()
    , `MarkmaidCLI is instantiable`);
  
  assert.ok(cli instanceof MarkmaidCLI
    , `Default export is MarkmaidCLI instance`);

  assert.ok([
    MarkmaidCLI.info,
    MarkmaidCLI.lookupFiles,
    MarkmaidCLI.resolve,
    MarkmaidCLI.version,
  ].every(m => m instanceof Function)
  , `Has expected static methods`);

  assert.equal(MarkmaidCLI.resolve('foo'), resolve(process.cwd(), 'foo')
    , `MarkmaidCLI.resolve resolves from working directory`);
  
  assert.deepEqual(
    (new MarkmaidCLI().parse(['--some-option', 'someValue'])).options,
    {
      '_': [],
      'some-option': 'someValue',
      'files': [],
      'outputDir': process.cwd(),
      'imageDir': `${process.cwd()}/docs/img`
    },
    `MarkmaidCLI parses options synchronously`
  );
  
  assert.equal(typeof cli.getHelpText(), 'string'
    , `cli.getHelpText() returns string`);

  assert.equal(typeof MarkmaidCLI.version(), 'string'
    , `MarkmaidCLI.version() prints string`);
  
  assert.deepEqual(
    MarkmaidCLI.lookupFiles('package.json'),
    ['package.json'],
    `MarkmaidCLI.lookupFiles() returns array`
  );

  assert.deepEqual(
    MarkmaidCLI.lookupFiles('**/*.md'),
    ['docs/README.md', 'README.md'],
    `MarkmaidCLI.lookupFiles() resolves glob patterns`);
  
  assert.equal(cli.parse().options.outputDir, process.cwd()
    , `cli.outputDir resolves output dir`);
    
  assert.equal(cli.parse().options.imageDir, `${process.cwd()}/docs/img`
    , `cli.imageDir resolves image dir`);
    
  assert.equal(cli.parse(['--image-dir', 'foo/bar']).options.imageDir, `${process.cwd()}/foo/bar`
    , `cli.imageDir resolves image dir`);
    
  assert.end();
});
