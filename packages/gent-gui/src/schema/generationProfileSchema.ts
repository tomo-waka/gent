export const generationProfileSchema: Record<string, unknown> = {
  title: "GenT Generation Profile",
  type: "object",
  properties: {
    $schema: {
      type: "string",
      minLength: 1,
    },
    debug: {
      type: "boolean",
    },
    from: {
      type: "string",
      format: "date-time",
    },
    to: {
      type: "string",
      format: "date-time",
    },
    count: {
      $ref: "#/$defs/commonNumberLike",
    },
    out: {
      $ref: "#/$defs/outputOptions",
    },
    templates: {
      type: "array",
      minItems: 1,
      items: {
        $ref: "#/$defs/templateOptions",
      },
    },
  },
  required: ["out", "templates"],
  additionalProperties: false,
  $defs: {
    commonNumberLike: {
      oneOf: [
        {
          type: "number",
        },
        {
          type: "string",
          pattern: "^-?(?:\\d+|\\d+\\.\\d+|\\.\\d+)$",
        },
      ],
    },
    templateMode: {
      type: "string",
      enum: ["text", "json"],
    },
    templateOptions: {
      type: "object",
      properties: {
        mode: {
          $ref: "#/$defs/templateMode",
        },
        path: {
          type: "string",
          minLength: 1,
        },
        weight: {
          $ref: "#/$defs/commonNumberLike",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
    outputOptions: {
      oneOf: [
        {
          type: "string",
          minLength: 1,
        },
        {
          $ref: "#/$defs/fileOutput",
        },
        {
          $ref: "#/$defs/udpOutput",
        },
        {
          $ref: "#/$defs/tcpOutput",
        },
        {
          $ref: "#/$defs/tlsOutput",
        },
      ],
    },
    fileOutput: {
      type: "object",
      properties: {
        type: {
          const: "file",
        },
        path: {
          type: "string",
          minLength: 1,
        },
        size: {
          type: "string",
        },
      },
      required: ["type", "path"],
      additionalProperties: false,
    },
    udpOutput: {
      type: "object",
      properties: {
        type: {
          const: "udp",
        },
        path: {
          type: "string",
          minLength: 1,
        },
        address: {
          type: "string",
          minLength: 1,
        },
        port: {
          $ref: "#/$defs/commonNumberLike",
        },
        eps: {
          $ref: "#/$defs/commonNumberLike",
        },
      },
      required: ["type", "address", "port"],
      additionalProperties: false,
    },
    tcpOutput: {
      oneOf: [
        {
          type: "object",
          properties: {
            type: {
              const: "tcp",
            },
            path: {
              type: "string",
              minLength: 1,
            },
            address: {
              type: "string",
              minLength: 1,
            },
            port: {
              $ref: "#/$defs/commonNumberLike",
            },
            eps: {
              $ref: "#/$defs/commonNumberLike",
            },
            framing: {
              const: "octet-counting",
            },
          },
          required: ["type", "address", "port"],
          additionalProperties: false,
        },
        {
          type: "object",
          properties: {
            type: {
              const: "tcp",
            },
            path: {
              type: "string",
              minLength: 1,
            },
            address: {
              type: "string",
              minLength: 1,
            },
            port: {
              $ref: "#/$defs/commonNumberLike",
            },
            eps: {
              $ref: "#/$defs/commonNumberLike",
            },
            framing: {
              const: "lf",
            },
            trailerReplacer: {
              type: "string",
            },
          },
          required: ["type", "address", "port", "framing"],
          additionalProperties: false,
        },
      ],
    },
    tlsOutput: {
      oneOf: [
        {
          type: "object",
          properties: {
            type: {
              const: "tls",
            },
            path: {
              type: "string",
              minLength: 1,
            },
            address: {
              type: "string",
              minLength: 1,
            },
            port: {
              $ref: "#/$defs/commonNumberLike",
            },
            eps: {
              $ref: "#/$defs/commonNumberLike",
            },
            framing: {
              const: "octet-counting",
            },
          },
          required: ["type", "address", "port"],
          additionalProperties: false,
        },
        {
          type: "object",
          properties: {
            type: {
              const: "tls",
            },
            path: {
              type: "string",
              minLength: 1,
            },
            address: {
              type: "string",
              minLength: 1,
            },
            port: {
              $ref: "#/$defs/commonNumberLike",
            },
            eps: {
              $ref: "#/$defs/commonNumberLike",
            },
            framing: {
              const: "lf",
            },
            trailerReplacer: {
              type: "string",
            },
          },
          required: ["type", "address", "port", "framing"],
          additionalProperties: false,
        },
      ],
    },
  },
};

export const initialGenerationProfile = {
  out: {
    type: "file",
    path: "./output.log",
  },
  templates: [
    {
      path: "./template.txt",
      mode: "text",
    },
  ],
};
