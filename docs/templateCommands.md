# Command list

* date
    * anytime
    * timestamp
        * format
* finance
    * creditCardCVV
    * creditCardIssuer
    * creditCardNumber
      * issuer
* hacker
    * hackerNoun
* internet
    * domainName
    * email
    * httpMethod
    * httpStatusCode
    * ip
    * ipv4
    * ipv6
    * mac
    * password
      * length
    * pri
    * url
    * userAgent
    * username
* location
    * country
    * countryCode
      * length
      * variant: 'alpha-2' | 'alpha-3' | 'numeric' (default: 'alpha-2')
  * timeZone
* lorem
    * loremSentences
      * min
      * max
* number
    * int
      * min
      * max
    * pid
* phone
    * imei
    * phoneNumber
      * style: 'human' | 'national' | 'international' (default: 'human')
* string
    * alpha
      * length
      * casing: 'upper' | 'lower' | 'mixed' (default: 'mixed')
    * alphanumeric
      * length
      * casing: 'upper' | 'lower' | 'mixed' (default: 'mixed')
    * binary
      * length
      * prefix (default: '0b')
    * hexadecimal
      * length
      * prefix (default: '0x')
    * numeric
      * length
    * octal
      * length
      * prefix (default: '0o')
    * ulid
    * uuid
* system
    * directoryPath
    * filePath
    * mimeType
    * networkInterface
    * semver
* others
    * length
      * min
      * max
