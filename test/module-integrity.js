import test from 'tape';
import loader from '../src/main';

test('Module integrity', assert => {

  assert.ok(loader
    , `loader should be defined`);
  
  assert.ok(loader instanceof Function
    , `loader should be a function`);
  
  assert.end();
});
