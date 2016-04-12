import parse from './parser';
import createImage from './mermaid-to-svg';
import { relative, resolve } from 'path';

function parseMarkdown(input, dir) {
  const { matches, output } = parse(input);

  return Promise.all(
    matches.map(match => createImage(match.code, dir).then(
      filename => Object.assign(match, { filename: relative(process.cwd(), filename) })
    ))
  ).then(matches => {
    const markdown = matches.reduce(
      (str, { filename, placeholder }) => {
        return str.replace(placeholder, `![img](${filename})`);
      }, output
    );

    return {
      markdown,
      images: matches.map(m => m.filename),
    };
  });
}

export {
  parseMarkdown as default,
};
