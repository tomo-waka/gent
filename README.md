# yet-another-data-generator

yet-another-log-generator is a template base dummy text data generator.

## features

* template base output text data format definition.
* generate dynamic value via variety of commands.
* meta file allows to manage multiple templates and their probabilities.
* json mode can control json structure.
* flexible output interface.

## Quick Start

install

```shell
npm install -g yet-another-data-generator
```

create example template file and save on `{dir path}/template.log`.

```text
<34>2020-01-20T06:27:36+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
```

execute following command.

```shell
yadg --template {dir path}/template.log --count 3
```

check out `{dir path}/out.log`

```text
<34>2020-01-20T06:27:36+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
<34>2020-01-20T06:27:36+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
<34>2020-01-20T06:27:36+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
```

you will see the exact same text as template three times.

back to template file and edit and embed `command`.

```text
<34>{{timestamp}} mymachine su: 'su root failed for lonvick on /dev/pts/8
```

execute command again.

```shell
yadg --template {dir path}/template.log --count 3
```

output will be like...

```text
<34>2024-11-20T17:55:12.963+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
<34>2024-11-21T03:02:42.440+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
<34>2024-11-21T08:45:03.377+09:00 mymachine su: 'su root failed for lonvick on /dev/pts/8
```
## Command list

[Command List](./docs/commands.md)

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
