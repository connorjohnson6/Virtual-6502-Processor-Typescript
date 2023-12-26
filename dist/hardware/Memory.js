"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const Hardware_1 = require("./Hardware");
class Memory extends Hardware_1.Hardware {
    constructor(debug, id, name) {
        super(debug, id, name);
        this._MEMORY_SIZE = 0xFFFF; // 65536, 16-bit address space
        this._memory = new Uint8Array(this._MEMORY_SIZE);
        this._mar = 0;
        this._mdr = 0;
    }
    // Initializes the memory array to 0 and logs the addressable space
    initializeMemory() {
        this._memory.fill(0);
        this.log(`Created - Addressable space: ${this._MEMORY_SIZE}`);
    }
    // Resets the memory array and registers to 0
    reset() {
        this._memory.fill(0);
        this._mar = 0;
        this._mdr = 0;
    }
    //just logs a statement
    pulse() {
        this.log(`\treceived clock pulse`);
    }
    // Getters and Setters for MAR and MDR
    getMAR() {
        return this._mar;
    }
    setMAR(value) {
        if (value < 0 || value >= this._MEMORY_SIZE) {
            throw new Error("Invalid MAR value");
        }
        this._mar = value;
    }
    getMDR() {
        return this._mdr;
    }
    setMDR(value) {
        if (value < 0 || value > 0xFF) {
            throw new Error("Invalid MDR value");
        }
        this._mdr = value;
    }
    // Reads a byte from the memory at the address in MAR and updates MDR
    read() {
        this.setMDR(this._memory[this.getMAR()]);
    }
    // Writes the byte in MDR to the memory at the address in MAR
    write() {
        this._memory[this.getMAR()] = this.getMDR();
    }
    getSize() {
        return this._MEMORY_SIZE;
    }
}
exports.Memory = Memory;
//# sourceMappingURL=Memory.js.map