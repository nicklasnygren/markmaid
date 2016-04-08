# markmaid

CLI tool that parses markdown files and renders mermaid snippets as images.

## How it works

1. Create a readme file with mermaid code snippet (for example, see the [readme source for
   this project](docs/README.md)).
2. Run `markmaid [filename]`
3. Commit and push
4. View the rendered result in your Github docs

```mermaid
graph TB
  subgraph Github repo
    A1("$ROOT/README.mdd")
    A2("$ROOT/README.md")
  end
  subgraph markmaid *.md
    B1(Break out mermaid snippets) -. Render snippets .-> B2("$ROOT/docs/img/[sha-1].png")
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
