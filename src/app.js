const Koa = require('koa');
const Moment = require('moment');
const Redis = require('ioredis');
const colors = require('colors');

// init global logger
global.logger = {
    error: (...msgs) => { console.error(colors.bgWhite.black(Moment().format('YYYY-MM-DD HH:mm:ss')), ...msgs); },
    warn: (...msgs) => { console.warn(colors.bgWhite.black(Moment().format('YYYY-MM-DD HH:mm:ss')), ...msgs); },
    info: (...msgs) => { console.info(colors.bgWhite.black(Moment().format('YYYY-MM-DD HH:mm:ss')), ...msgs); },
    debug: (...msgs) => { console.debug(colors.bgWhite.black(Moment().format('YYYY-MM-DD HH:mm:ss')), ...msgs); },
}

// init Data Model
const store = new Redis({
    host: process.env.REDISHOST || '127.0.0.1',
    port: Number(process.env.REDISPORT) || 6379,
    socket_keepalive: true,
});

global.logger.info(`redis connected`);

// init Koa
const app = new Koa();
app.proxy = true; // to get real IP 

app.use((ctx, next) => {
    // bind Store Object to every request
    ctx.Store = store;
    // get setting from ENV
    const { RESETSEC, RATE } = process.env;
    const resetSec = Number(RESETSEC) || 60;
    const rate = Number(RATE) || 60;
    ctx.Conf = {
        ResetSec: resetSec,
        Rate: rate,
    }
    return next();
});

// get state & incr count to redis
app.use(async (ctx) => {
    // set a new value only when the key is not exist
    await ctx.Store.set(ctx.ip, 0,'EX', ctx.Conf.ResetSec, 'NX');
    // incr value
    const cnt = await ctx.Store.incr(ctx.ip);
    global.logger.debug(`ip: ${ctx.ip} cnt: ${cnt}/${ctx.Conf.Rate}`);

    if (cnt <= ctx.Conf.Rate) {
        ctx.body = `Msg: ${cnt}` ;
        return ctx.status = 200;
    }
    else {
        ctx.body = `Msg: Error`;
        return ctx.status = 429;  // Too Many Requests
    }
});


module.exports = { app, store };