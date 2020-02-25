const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  const id = ctx.request.query.r ? ctx.request.query.r : Math.random().toString();
  const message = await new Promise((resolve) => {
    subscribers[id] = resolve;
  });
  ctx.body = message;
  delete subscribers[id];
});


router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.status = 200;
    return;
  }
  for (const id in subscribers) {
    if (subscribers[id]) {
      const resolve = subscribers[id];
      resolve(message);
      ctx.status = 200;
    }
  }
});

app.use(router.routes());

module.exports = app;
