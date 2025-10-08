"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
class ChatService {
    constructor() { }
    sayHi = ({ message, socket, callback }) => {
        console.log({ message });
        callback ? callback("Hello BE to FE") : undefined;
    };
}
exports.ChatService = ChatService;
