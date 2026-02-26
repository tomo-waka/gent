import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

server.get("/health", () => {
  return { status: "ok" };
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

await server.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  console.log(`app-server running at http://localhost:${PORT.toString()}`);
});
