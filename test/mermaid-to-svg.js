import test from 'tape';
import { unlink } from 'fs';
import createSvg, { getHash, getImageFilename } from '../src/mermaid-to-svg';

test('Mermaid to image translator', assert => {
  const asyncTests = [];

  assert.ok(createSvg
    , `createSvg should be defined`);
  
  assert.ok(createSvg
    , `createSvg should be a function`);
  
  assert.equal(getHash('hej'), 'c412b37f8c0484e6db8bce177ae88c5443b26e92'
    , `Assertion should pass`);
  
  const input = 'graph TD;\na-->b;';
  const expectedFileName = getImageFilename(getHash(input));
  asyncTests.push(createSvg(input).then(res => assert.equal(res, expectedFileName
    , `Writes png file to disk`)));
  
  Promise.all(asyncTests)
    .then(() => unlink(expectedFileName))
    .then(() => assert.end());
});
