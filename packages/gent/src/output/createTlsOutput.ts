import * as stream from "node:stream";
import * as tls from "node:tls";
import type { TlsOutputOptions } from "../types.js";

export async function createTlsOutput(
  outputOptions: TlsOutputOptions,
): Promise<stream.Writable> {
  const tlsOptions: tls.ConnectionOptions = {
    host: outputOptions.address,
    port: outputOptions.port,
    rejectUnauthorized: false,
    // key: fs.readFileSync(path.join(__dirname, 'client-key.pem')),
    // cert: fs.readFileSync(path.join(__dirname, 'client-cert.pem')),
    // ca: [fs.readFileSync(path.join(__dirname, 'ca-cert.pem'))]
  };
  const client = tls.connect(tlsOptions);
  return client;
}
