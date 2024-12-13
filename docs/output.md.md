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
    "type": "path-to-out.log",
    "size": "10M"
  }
}
```

* size(optional): rotate file size. (e.g. "10M")

## udp

```json
{
  "out": {
    "type": "udp",
    "address": "127.0.0.1",
    "port": 514
  }
}
```
* address: destination ip address.
* port: destination port.

## tcp

### octet-counting

```json
{
  "out": {
    "type": "tcp",
    "address": "127.0.0.1",
    "port": 514,
    "framing": "octet-counting"
  }
}
```
* address: destination ip address.
* port: destination port.
* framing: `octet-counting`

### lf framing

```json
{
  "out": {
    "type": "tcp",
    "address": "127.0.0.1",
    "port": 514,
    "framing": "lf",
    "trailerReplacer": " "
  }
}
```
* address: destination ip address.
* port: destination port.
* framing: `lf`
* trailerReplacer(optional): replace trailer string (which is `lf`) with other string.
