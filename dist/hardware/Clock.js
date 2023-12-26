"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
const Hardware_1 = require("./Hardware");
class Clock extends Hardware_1.Hardware {
    constructor(debug, id, name) {
        super(debug, id, name);
        this._listeners = [];
    }
    addListener(listener) {
        this._listeners.push(listener);
    }
    initializeClock() {
        const message = "\tClock Pulse Initialized";
        // Send pulse to all listeners (.addListener Cpu and Memory)
        for (const listener of this._listeners) {
            listener.pulse();
        }
        this.log(message);
    }
    startClock(CLOCK_INTERVAL) {
        // If there's an existing interval, clear it first
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
        this._intervalId = setInterval(this.initializeClock.bind(this), CLOCK_INTERVAL);
    }
    stopClock() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = undefined; // Clear the interval ID after stopping the clock
            this.log("Clock Pulse Stopped");
        }
        else {
            this.log("Clock Pulse was not running");
        }
    }
    //only added this bc the clock was being bitchy due to the implement ClockListener
    pulse() {
        throw new Error("Method not implemented.");
    }
}
exports.Clock = Clock;
//# sourceMappingURL=Clock.js.map