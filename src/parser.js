const PLACEHOLDER = 'MD_PARSER_MATCH';

const whitespaceExp = /[ \t]{2,}/g;
const codeBlockExp = /```mermaid([\s\S]*?)```/g;

function getPlaceHolderStr(idx) {
  return `${PLACEHOLDER}:${idx}:/${PLACEHOLDER}`;
}

function parse(input) {
  if (typeof input !== 'string') {
    throw new Error(`Markdown parser must be supplied a string, got ${typeof input}`);
  }

  const matches = [];
  const output = input.replace(codeBlockExp, (match, str) => {
    const code = str.replace(whitespaceExp, '');
    const placeholder = getPlaceHolderStr(matches.length);
    matches.push({
      code,
      placeholder,
    });
    return placeholder;
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
  getPlaceHolderStr,
};
