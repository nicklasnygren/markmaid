import test from 'tape';
import parse, { PLACEHOLDER } from '../src/parser';

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
    assert.equal(err.message, `Markdown parser must be supplied a string`
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
    `# Markdown with code block

    \`\`\`mermaid
    test
    \`\`\``;
  const parsedCodeblock = 
    `# Markdown with code block

    ${PLACEHOLDER}:0:/${PLACEHOLDER}`;
  assert.deepEqual(
    parse(codeblock),
    {
      input: codeblock,
      matches: ['\ntest\n'],
      output: parsedCodeblock,
    },
    `Returns list of matches and preprocessed output property when match exists`
  );

  assert.end();
});
