import sinon from 'sinon';
import test from 'tape';
import module from '../src';

test('Module integrity', assert => {
  const asyncTests = [];

  assert.ok(module
    , `module should be defined`);
  
  assert.ok(module instanceof Function
    , `module should be a function`);
  
  const markdown = 
    `
    # Markdown with two code blocks

    \`\`\`mermaid
    graph TD;
      a-->b;
    \`\`\`

    \`\`\`mermaid
    graph TD;
      a-->b;
      b-->a;
    \`\`\`
    `;

  const expectedResult = 
    `
    # Markdown with two code blocks

    \`\`\`mermaid
    graph TD;
      a-->b;
    \`\`\`

    \`\`\`mermaid
    graph TD;
      a-->b;
      b-->a;
    \`\`\`
    `;
  asyncTests.push(module(markdown).then(res => assert.equal(typeof res, 'string'
    , `Running module should return parsed string`)));
  
  Promise.all(asyncTests).then(() => assert.end());
});
