markmaid [![Build Status](https://travis-ci.org/nicklasnygren/markmaid.svg?branch=master)](https://travis-ci.org/nicklasnygren/markmaid)
========

CLI tool to parse markdown files and renders [Mermaid](https://github.com/knsv/mermaid) snippets as images.

Requires Node 4.0 or greater.

## How it works

1. Create a readme file with mermaid code snippet (for example, see the [readme source for
   this project](docs/README.md)).
2. Run `markmaid [filename]`
3. Commit and push
4. View the rendered result in your Github docs

As flow chart | As sequence diagram
--- | ---
![img](docs/img/108d88de7bc67ea3dcc1af6a32ae2b4f0438cba8.png) | ![img](docs/img/99bc8e408631eb49644115fc35ae4c216d40f583.png)

It even works in tables!

## Installation

Install the markmaid command line tool with npm:

```sh
npm install -g markmaid
```
