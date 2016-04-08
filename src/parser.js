const PLACEHOLDER = 'MD_PARSER_MATCH';

const whitespaceExp = /[ \t]{2,}/g;
const codeBlockExp = /```mermaid([\s\S]*)```/mg;

function parse(input) {
  if (typeof input !== 'string') {
    throw new Error('Markdown parser must be supplied a string');
  }

  const matches = [];
  const output = input.replace(codeBlockExp, (match, str) => {
    matches.push(str.replace(whitespaceExp, ''));
    return `${PLACEHOLDER}:${matches.length - 1}:/${PLACEHOLDER}`;
  });

  return {
    input,
    matches,
    output,
  };
}

export {
  parse as default,
  PLACEHOLDER,
};
