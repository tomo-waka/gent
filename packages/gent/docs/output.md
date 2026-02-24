# Output

> [!NOTE]
> You can describe following output methods only in Generation Profile JSON, not in CLI options.
> only simple file output is available in cli.

## Generation Profile schema

Generation Profile schema is available at `packages/gent/schema/program-options.schema.json`.

Add `$schema` at the top of your Generation Profile JSON to enable editor completion and validation.

```json
{
  "$schema": "../schema/program-options.schema.json"
}
```

## file

shorthand file output.

```json
{
  "out": "path-to-out.log"
}
```

file output with options.

```json
{
  "out": {
    "type": "file",
    "path": "path-to-out.log",
    "size": "10M"
  }
}
```

- type: `file`
- path: path to output file.
- size(optional): rotate file size. (e.g. "10M")

## udp

```json
{
  "out": {
    "type": "udp",
    "address": "127.0.0.1",
    "port": 514,
    "eps": 1000
  }
}
```

- type: `udp`
- address: destination ip address.
- port: destination port.
- eps(optional): throttle data generate. event per second. (default: 3000)

## tcp

### octet-counting

```json
{
  "out": {
    "type": "tcp",
    "address": "127.0.0.1",
    "port": 514,
    "eps": 1000,
    "framing": "octet-counting"
  }
}
```

- type: `tcp`
- address: destination ip address.
- port: destination port.
- eps(optional): throttle data generate. event per second. (default: 3000)
- framing: `octet-counting`

### lf framing

```json
{
  "out": {
    "type": "tcp",
    "address": "127.0.0.1",
    "port": 514,
    "eps": 1000,
    "framing": "lf",
    "trailerReplacer": " "
  }
}
```

- type: `tcp`
- address: destination ip address.
- port: destination port.
- eps(optional): throttle data generate. event per second. (default: 3000)
- framing: `lf`
- trailerReplacer(optional): replace trailer string (which is `lf`) with other string.

## tls

### octet-counting

```json
{
  "out": {
    "type": "tls",
    "address": "127.0.0.1",
    "port": 514,
    "eps": 1000,
    "framing": "octet-counting"
  }
}
```

- type: `tls`
- address: destination ip address.
- port: destination port.
- eps(optional): throttle data generate. event per second. (default: 3000)
- framing: `octet-counting`

### lf framing

```json
{
  "out": {
    "type": "tls",
    "address": "127.0.0.1",
    "port": 514,
    "eps": 1000,
    "framing": "lf",
    "trailerReplacer": " "
  }
}
```

- type: `tls`
- address: destination ip address.
- port: destination port.
- eps(optional): throttle data generate. event per second. (default: 3000)
- framing: `lf`
- trailerReplacer(optional): replace trailer string (which is `lf`) with other string.
