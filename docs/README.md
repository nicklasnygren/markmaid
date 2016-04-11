# markmaid

[![Build Status](https://travis-ci.org/nicklasnygren/markmaid.svg?branch=master)](https://travis-ci.org/nicklasnygren/markmaid)

CLI tool to parse markdown files and renders [Mermaid](https://github.com/knsv/mermaid) snippets as images.

Requires Node 4.0 or greater.

## How it works

1. Create a readme file with mermaid code snippet (for example, see the [readme source for
   this project](docs/README.md)).
2. Run `markmaid [filename]`
3. Commit and push
4. View the rendered result in your Github docs

```mermaid
graph TB
  subgraph Github repo
    A1("$ROOT/docs/README.md")
    A2("$ROOT/README.md")
  end
  subgraph markmaid 'docs/**/*.md'
    B1(Break out mermaid snippets) -. Render snippets .-> B2("$ROOT/docs/img/<sha-1>.png")
  end
  A1 -.->A2
  A1 ==> B1
  B2 == Link to images ==> A2
```

## Installation

Install the markmaid command line tool with npm:

```sh
npm install -g mermaid
```
