import test from 'tape';
import cli, { MarkmaidCLI } from '../src/cli';
import { resolve } from 'path';

test('CLI', assert => {

  assert.ok(new MarkmaidCLI()
    , `MarkmaidCLI is instantiable`);
  
  assert.ok(cli instanceof MarkmaidCLI
    , `Default export is MarkmaidCLI instance`);

  assert.equal(MarkmaidCLI.resolve('foo'), resolve(process.cwd(), 'foo')
    , `MarkmaidCLI.resolve resolves from working directory`);
  
  
  assert.deepEqual(
    (new MarkmaidCLI().parse(['--some-option', 'someValue'])).options,
    { '_': [], 'some-option': 'someValue', 'files': [] },
    `MarkmaidCLI parses options synchronously`
  );
  
  assert.end();
});
