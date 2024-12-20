# Output

> [!NOTE]
> You can describe following output method only in meta file but cli.
> only simple file output is available in cli.

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

* type: `file`
* path: path to output file.
* size(optional): rotate file size. (e.g. "10M")

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
* type: `udp`
* address: destination ip address.
* port: destination port.
* eps(optional): throttle data generate. event per second. (default: 3000)

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
* type: `tcp`
* address: destination ip address.
* port: destination port.
* eps(optional): throttle data generate. event per second. (default: 3000)
* framing: `octet-counting`

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
* type: `tcp`
* address: destination ip address.
* port: destination port.
* eps(optional): throttle data generate. event per second. (default: 3000)
* framing: `lf`
* trailerReplacer(optional): replace trailer string (which is `lf`) with other string.
