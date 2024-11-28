# yet-another-data-generator

## Introduction

yet-another-data-generator is a template-based dummy text data generator. The generated data is used as test data for software that process such data. You can define data format with a simple text file (referred to as a "template") and obtain the output as text file. It means that both input and output are non-programing interfaces. These features are particularly useful as test data in end-to-end testing situations, rather than in Unit testing.

## Features

* "template" and "template commands"
    * define generating text data format with a "template" which is a simple text file.
    * embed "template commands" within a "template" with special syntax.
    * "template commands" generate dynamic value, thus generating data will be non-static.
    * there are various "template commands" and also easily add new command.
* "meta file"
    * meta file allows to manage multiple templates and their probabilities.
* "json mode"
    * json mode can control json structure.
* output
    * flexible output interface.

## Quick Start

install with npm globally.

```shell
npm install -g yet-another-data-generator
```

> [!NOTE]
> This quick start explains the steps how to use yet-another-data-generator as shell cli application. If you are looking for how to use as a dependency or how to develop, see other sections.

Then, create a template. Save the following content as a text file in any directory, for instance `{dir path}/template.log`.

```text
<34>{{timestamp}} mymachine su: 'su root failed for lonvick on /dev/pts/8
```

Above content of template is a syslog format log but its timestamp part has been replaced with template command syntax `{{timestamp}}`.

Then, execute following command with previously created template path.

```shell
yadg --template {dir path}/template.log --count 3
```
output file `out.log` will be created in current working directory.
And content of output will be like following.

```text
<34>2024-11-20T17:55:12.963+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
<34>2024-11-21T03:02:42.440+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
<34>2024-11-21T08:45:03.377+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
```
Each text line is almost same as template content but template command part has been replaced with generated text by the template command.

This is basic mechanics of yet-another-data-generator.

Fully customized template example is following

```text
<{{pri}}>{{timestamp --format "MMM dd hh:mm:ss"}} {{ipv4}} {{hacker.noun --variations 3}}[{{pid}}]: {{lorem.sentences}}
```

## Template

Template file defines generating text data format.

Template is basically just a text file. You can embed template command with special syntax.
So yet-another-data-generator process template command and replace command expression with command result.

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

[Command List](./docs/templateCommands)

## Meta template sample

```json
{
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

## Json mode

### special commands

* array length

```json
"{{length --min 2 --max 5}}"
```

* array item weight

```json
{
  "{{weight}}": 1
}
```

* value probability

```json
{
  "{{probability}}": 50
}
```

* dynamic value

```json
{
  "{{type}}": "number",
  "{{content}}": "{{int}}"
}
```
