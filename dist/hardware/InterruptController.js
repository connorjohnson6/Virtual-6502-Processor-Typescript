"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterruptController = void 0;
const Hardware_1 = require("./Hardware");
class InterruptController extends Hardware_1.Hardware {
    constructor(debug, id, name) {
        super(debug, id, name);
        this.interruptQueue = [];
        this.registeredDevices = new Map();
    }
    registerDevice(device) {
        this.registeredDevices.set(device.IRQNum, device);
    }
    acceptInterrupt(interrupt) {
        this.interruptQueue.push(interrupt);
        this.interruptQueue.sort((a, b) => a.priority - b.priority);
    }
    getNextInterrupt() {
        return this.interruptQueue.shift() || null;
    }
    clearInputBuffer() {
        this.interruptQueue = [];
    }
}
exports.InterruptController = InterruptController;
//# sourceMappingURL=InterruptController.js.map