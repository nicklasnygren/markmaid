import test from 'tape';
import parse, { PLACEHOLDER, getPlaceHolderStr } from '../src/parser';

test('Markdown parser', assert => {
  
  assert.ok(parse
    , `parser should be defined`);
  
  assert.ok(parse instanceof Function
    , `parser is a function`);
  
  assert.equal(PLACEHOLDER, 'MD_PARSER_MATCH'
    , `parser provides a placeholder constant`);
  
  try {
    parse({});
  }
  catch (err) {
    assert.equal(err.message, `Markdown parser must be supplied a string, got object`
      , `Markdown parsers should throw error if fed anything but a string`);
  }

  assert.deepEqual(
    parse(`# Markdown without code block`),
    {
      input: `# Markdown without code block`,
      matches: [],
      output: `# Markdown without code block`,
    },
    `Returns object describing parse results when fed string`
  );
  
  const codeblock =
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
  const parsedCodeblock = 
    `
    # Markdown with two code blocks

    ${PLACEHOLDER}:0:/${PLACEHOLDER}

    ${PLACEHOLDER}:1:/${PLACEHOLDER}
    `;
  assert.deepEqual(
    parse(codeblock),
    {
      input: codeblock,
      matches: [{
        code: '\ngraph TD;\na-->b;\n',
        placeholder: getPlaceHolderStr(0),
      }, {
        code: '\ngraph TD;\na-->b;\nb-->a;\n',
        placeholder: getPlaceHolderStr(1),
      }],
      output: parsedCodeblock,
    },
    `Returns list of matches and preprocessed output property when match exists`
  );

  assert.end();
});
