"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectChannel = exports.channel = void 0;
const { Socket } = require('phoenix-channels');
const log_1 = require("./log");
var socket, channel;
exports.channel = channel;
function connectChannel() {
    return __awaiter(this, void 0, void 0, function* () {
        const WEBSOCKET_SERVER_URL = process.env.WEBSOCKET_SERVER_URL || "ws://54.174.184.168:4455/worker/socket";
        socket = new Socket(WEBSOCKET_SERVER_URL);
        log_1.log.info('pool.socket.connect', WEBSOCKET_SERVER_URL);
        socket.connect();
        // Now that you are connected, you can join channels with a topic:
        exports.channel = channel = socket.channel("cpuworkers:jobs", {});
        channel.join()
            .receive("ok", resp => { console.log("pool.socket.connected", resp); })
            .receive("error", resp => { console.log("pool.socket.error", resp); });
        return channel;
    });
}
exports.connectChannel = connectChannel;
//# sourceMappingURL=socket.js.map