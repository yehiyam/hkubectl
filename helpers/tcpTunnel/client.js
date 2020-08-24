const ws = require('websocket-stream');
const { createServer } = require('net');
const pipe = require('pump');

const onError = (err) => {
    if (err) console.error(`[Tunnel] ${err.messeage || err}`);
};

const startClient = (tunnel, target, port, options) => {
    return new Promise((resolve) => {
        const tcpServer = createServer((local) => {
            const remote = ws(tunnel + (tunnel.slice(-1) === '/' ? '' : '/') + target, options);
            pipe(remote, local, onError);
            pipe(local, remote, onError);
        });
        tcpServer.on('error', onError);
        tcpServer.listen(port, onError);
        resolve();
    });
};

module.exports = startClient;
