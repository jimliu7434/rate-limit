const request = require('request');
const Moment = require('moment');
const colors = require('colors');

// init global logger
global.logger = {
    error: (...msgs) => { console.error(colors.bgWhite.black(Moment().format('YYYY-MM-DD HH:mm:ss.SSS')), ...msgs); },
    warn: (...msgs) => { console.warn(colors.bgWhite.black(Moment().format('YYYY-MM-DD HH:mm:ss.SSS')), ...msgs); },
    info: (...msgs) => { console.info(colors.bgWhite.black(Moment().format('YYYY-MM-DD HH:mm:ss.SSS')), ...msgs); },
    debug: (...msgs) => { console.debug(colors.bgWhite.black(Moment().format('YYYY-MM-DD HH:mm:ss.SSS')), ...msgs); },
}

const FakeData = [
    {
        ip: '10.10.10.10',
        msInterval: 1000,   //  = 60 req / min
    },
    {
        ip: '20.20.20.20',
        msInterval: 5000,   // = 12 req / min
    },
    {
        ip: '30.30.30.30',
        msInterval: 10000,  // = 6 req / min
    },
    {
        ip: '40.40.40.40',
        msInterval: 200,  // = 300 req / min
    },
];

const target = `http://${process.argv[2]}/test`;

(() => {
    const sendRequest = (uri, ip) => {
        setImmediate(() => {
            request({
                uri: uri,
                method: 'GET',
                headers: {
                    // fake ip
                    'X-Client-IP': ip,
                    'X-Real-IP': ip,
                    'X-Forwarded-For': ip,
                }
            }, (err, res, body) => {
                if (err) {
                    global.logger.error(err.message);
                }
                else {
                    global.logger.info(`ip: ${ip} code:${res.statusCode}  msg: ${body}`);
                }
            });
        });
    }

    for (const d of FakeData) {
        setInterval(() => {
            sendRequest(target, d.ip);
        }, d.msInterval);
        sendRequest(target, d.ip);
    }
})();