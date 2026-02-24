# GenT

![GenT logo](https://github.com/tomo-waka/gent/raw/main/media/gent_logo.png)

[![NPM Version](https://img.shields.io/npm/v/%40gent-js%2Fgent)](https://www.npmjs.com/package/@gent-js/gent)
[![NPM License](https://img.shields.io/npm/l/%40gent-js%2Fgent)](https://github.com/tomo-waka/gent/blob/main/LICENSE)

## Introduction

GenT is a template-based data generator. The generated data is a kind of "dummy data," but GenT was developed with the following goals:

- Generate data that closely resembles real-world data.
- Flexibly support text data across a wide range of formats.
- Let users customize this behavior through a non-programming interface.

Like other dummy data, generated output can be used as sample data for application mocks or as test data. GenT is especially useful in situations where data should not look mechanically generated, but instead appear realistic.

## Features

- "template" and "template commands"
  - To generate natural-looking data across various formats, GenT uses a mechanism called "template" and "template commands."
  - A "template" is a simple text file in which users can freely describe the data (text) they want to generate.
  - Within a "template," users can embed "template commands" using a special syntax.
  - "Template commands" generate dynamic values at generation time, resulting in output data with rich variations.
  - There are many kinds of "template commands," and extending them is straightforward.
- "Generation Profile"
  - A "Generation Profile" allows more advanced generation settings that cannot be configured only with CLI options.
  - For example, you can combine multiple templates and specify their probabilities.
  - A "Generation Profile" is also used when you want outputs other than file output (described later).
- "json mode"
  - "json mode" provides powerful features for generating JSON-formatted data.
  - In addition to standard features, "json mode" can control JSON structure, including the presence and number of elements.
- various output methods
  - Writing generated data to a file is the most basic output method, but you can also rotate output files or send data directly over the network.

## Quick Start

> [!NOTE]
> This quick start explains the steps how to use GenT as shell cli application. If you are looking for how to use as a dependency or how to develop, see other sections.

install with npm globally.

```shell
npm install -g @gent-js/gent
```

Then, create a template. Save the following content as a text file in any directory, for instance `{dir path}/template.log`.

```text
<34>{{timestamp}} mymachine su: 'su root failed for lonvick on /dev/pts/8
```

Above content of template is a syslog format log but its timestamp part has been replaced with template command syntax `{{timestamp}}`.

Then, execute following command with previously created template path.

```shell
gent --template {dir path}/template.log --count 3
```

output file `out.log` will be created in current working directory.
And content of output will be like following.

```text
<34>2024-11-20T17:55:12.963+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
<34>2024-11-21T03:02:42.440+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
<34>2024-11-21T08:45:03.377+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
```

Each text line is almost same as template content but template command part has been replaced with generated text by the template command.

This is basic mechanics of GenT.

Fully customized template example is following

```text
<{{pri}}>{{timestamp --format "MMM dd hh:mm:ss"}} {{ipv4}} {{hacker.noun --variations 3}}[{{pid}}]: {{lorem.sentences}}
```

## Template

Template file defines generating text data format.

Template is basically just a text file. You can embed template command with special syntax.
So GenT process template command and replace command expression with command result.

## Template Commands

basic template command syntax is following.

```text
{{command_name}}
```

Some commands accept command option, command and option syntax is like shell command syntax.

```text
{{command_name --optA --optBWithValue value}}
```

supporting template commands and their options are below.

[Command List](./docs/template-commands.md)

## Generation Profile Sample

```json
{
  "$schema": "./schema/program-options.schema.json",
  "from": "2000-01-01T00:00:00+09:00",
  "to": "2020-12-31T23:59:59+09:00",
  "count": 100,
  "out": "out.log",
  "templates": [
    {
      "path": "template.log"
    }
  ]
}
```

## Generation Profile JSON Schema

`packages/gent/schema/program-options.schema.json` defines the Generation Profile structure (`ProgramOptions` at runtime).

If you put the schema reference in your Generation Profile JSON file, VS Code can provide completion and validation.

```json
{
  "$schema": "./schema/program-options.schema.json"
}
```

## Json mode

### special commands

- array length

```json
"{{length --min 2 --max 5}}"
```

- array item weight

```json
{
  "{{weight}}": 1
}
```

- value probability

```json
{
  "{{probability}}": 50
}
```

- dynamic value

```json
{
  "{{type}}": "number",
  "{{content}}": "{{int}}"
}
```

## Output

in cli, specify output path with `out` option.

```shell
gent --template {dir path}/template.log --count 3 --out path-to-out.log
```

in Generation Profile JSON, specify output path with `out` key.

```json
{
  "out": "path-to-out.log"
}
```

moreover, you can use various output method and options in Generation Profile JSON. see [output](./docs/output.md) for details.

## Development

[development](./docs/developing.md)
