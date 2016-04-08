import sinon from 'sinon';
import test from 'tape';
import module from '../src';

test('Module integrity', assert => {

  assert.ok(module
    , `module should be defined`);
  
  assert.ok(module instanceof Function
    , `module should be a function`);
  
  const cacheable = sinon.spy();
  module.call({ cacheable });
  assert.equal(cacheable.called, true
    , `Loader is cacheable`);
  
  assert.end();
});
