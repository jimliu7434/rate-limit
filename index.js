const { app } = require('./src/app.js');
const port = Number(process.env.WEBPORT) || 80;

app.listen(port, () => {
    global.logger.info(`listening ${port}`);
});