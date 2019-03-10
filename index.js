const emotiv = require('bindings')('emotiv');

let _open = false;
let running = false;

let _cb = () => { };

function setLogger(logger) {
    emotiv.setLogger(logger);
}

function open() {
    if (_open) return;

    let rv = 1;
    let retries = 0;

    do {
        if (retries == 10) break;

        rv = emotiv.connect();
        retries++;
    } while (rv)

    if (rv == 0) {
        _open = true;
        running = true;
    }

    return rv == 0;
}

function close() {
    if (!_open) return;

    emotiv.disconnect();

    _open = false;
    running = false;
}

function read(cb) {
    _cb = cb;

    if (!_open) return;
    emotiv.read(_work)
}

function pause() {
    if (!_open) return;

    running = false;
}

function resume() {
    if (!_open) return;

    running = true;

    emotiv.read(_work);
}

function _work(err, res) {
    if (!running) return;

    _cb(res);
    emotiv.read(_work);
}

setLogger(msg => console.log(msg.trim()));

module.exports = { open, close, pause, read, resume, setLogger };
