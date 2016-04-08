import parse from './parser';
import createImage from './mermaid-to-svg';
import { relative, resolve } from 'path';

const ROOT = resolve(__dirname, '..');

function markdownMermaidLoader(input, dir) {
  const { matches, output } = parse(input);

  return Promise.all(
    matches.map(match => createImage(match.code, dir).then(
      filename => Object.assign(match, { filename: relative(ROOT, filename) })
    ))
  ).then(matches => matches.reduce(
     (str, { filename, placeholder }) => str.replace(placeholder, `![img](${filename})`), output
  ));
}

export {
  markdownMermaidLoader as default,
};
