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
* japanese
    * hyakuninIsshu
        * generate [小倉百人一首](https://en.wikipedia.org/wiki/Ogura_Hyakunin_Isshu)
        * generated text includes LF code.
    * shogun
        * generate shogun name of [徳川幕府](https://en.wikipedia.org/wiki/Tokugawa_shogunate)
        * probability is based on their period of reign.
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
