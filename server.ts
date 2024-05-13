import Router from "@koa/router";
import Koa from "koa";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = new Koa();
const router = new Router();

router.all("(.*)", async (ctx) => {
  try {
    await handle(ctx.req, ctx.res);
    console.info("handled request", {
      path: ctx.path,
      status: ctx.status,
      "res.status": ctx.res.statusCode,
    });
  } catch (error) {
    console.error("error while handling request", { error });
    throw error;
  }
  ctx.respond = false;
});

server.use(router.routes());

app.prepare().then(() => {
  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  console.info("Shutting down application");
  process.exit(0);
}
