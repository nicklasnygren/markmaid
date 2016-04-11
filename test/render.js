import sinon from 'sinon';
import test from 'tape';
import render from '../src/render';

test('Render', assert => {
  const asyncTests = [];

  assert.ok(render
    , `render should be defined`);
  
  assert.ok(render instanceof Function
    , `render should be a function`);
  
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
  asyncTests.push(render(markdown).then(res => assert.equal(typeof res, 'string'
    , `Running render should return parsed string`)));
  
  Promise.all(asyncTests).then(() => assert.end());
});
