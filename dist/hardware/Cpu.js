"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cpu = void 0;
const Ascii_1 = require("./Ascii");
const Hardware_1 = require("./Hardware");
const Keyboard_1 = require("./Keyboard");
class Cpu extends Hardware_1.Hardware {
    constructor(debug, id, name) {
        super(debug, id, name);
        this.clock = null;
        // Initialize registers and pipeline step
        this.accumulator = 0x00;
        this.registerX = 0x00;
        this.registerY = 0x00;
        this.programCounter = 0x0000;
        this.instructionRegister = 0x00;
        this.operand = 0x00;
        this.testValue = 0x00;
        this.zFlag = 0x00;
        this.pipelineStep = 0x00;
        this.cpuClockCount = 0;
    }
    readStringFromMemory(address) {
        let str = "";
        let byte = this.mmu.readImmediate(address);
        while (byte !== 0x00) { // Loop until 0x00 is found
            str += Ascii_1.Ascii.decode(byte);
            address++;
            byte = this.mmu.readImmediate(address);
        }
        return str;
    }
    setMmu(mmu) {
        this.mmu = mmu;
    }
    addController(Controller) {
        this.interruptController = Controller;
    }
    setClock(clock) {
        this.clock = clock;
    }
    fetch() {
        this.instructionRegister = this.mmu.readImmediate(this.programCounter);
        this.log("---------------Fetched instruction: " + this.instructionRegister.toString(16).toUpperCase() + " from address: " + this.programCounter.toString(16).toUpperCase());
        this.programCounter++; // Increment after fetching the instruction
    }
    decode() {
        switch (this.instructionRegister) {
            case 0xA9: // LDA 
            case 0xA2: // LDX 
            case 0xA0: // LDY 
            case 0xD0: // BNE
                // These opcodes have a one-byte operand
                this.operand = this.mmu.readImmediate(this.programCounter);
                this.programCounter++;
                this.pipelineStep = 0x03; // Go to execute
                break;
            case 0x8D: // STA 
            case 0x6D: // ADC 
            case 0xAC: // LDY 
            case 0xAD: // LDA 
            case 0xAE: // LDX 
            case 0xEC: // CPX
            case 0xEE: // INC
                // First byte (low byte) of two-byte operand
                this.lowOrderByte = this.mmu.readImmediate(this.programCounter);
                this.programCounter++; // Increment PC to fetch high byte next
                this.pipelineStep = 0x02; // Go to highorder
                break;
            case 0x8A: // TXA
            case 0x98: // TYA
            case 0xAA: // TAX
            case 0xA8: // TAY
                this.pipelineStep = 0x03; // go to: decode
                break;
            case 0xEA: //NOP
                this.pipelineStep = 0x05; // Go to: interrupt check
                break;
            case 0x00: // BRK
                if (this.clock) {
                    this.clock.stopClock();
                }
                break;
            case 0xFF: // SYS
                if (this.registerX === 0x03) {
                    // two-byte address
                    this.lowOrderByte = this.mmu.readImmediate(this.programCounter++);
                    this.pipelineStep = 0x02; // go to: highorder
                }
                else {
                    this.pipelineStep = 0x03; // go to: execute
                }
                break;
        }
    }
    highorder() {
        switch (this.instructionRegister) {
            case 0x8D: // STA 
            case 0x6D: // ADC 
            case 0xAC: // LDY 
            case 0xAD: // LDA 
            case 0xAE: // LDX 
            case 0xEC: // CPX
            case 0xEE: // INC
            case 0xFF: // System call regX = 3
                // Second byte (high byte) of two-byte operand
                this.highOrderByte = this.mmu.readImmediate(this.programCounter);
                this.programCounter++;
                this.operand = (this.highOrderByte << 8) | this.lowOrderByte;
                this.pipelineStep = 0x03; // Go to execute
                break;
        }
    }
    execute() {
        switch (this.instructionRegister) {
            case 0xA9: // LDA 
                this.accumulator = this.operand;
                break;
            case 0xAD: // LDA 
                this.accumulator = this.mmu.readImmediate(this.operand);
                break;
            case 0x8D: // STA 
                this.mmu.writeImmediate(this.operand, this.accumulator);
                break;
            case 0x6D: // ADC 
                let memValue = this.mmu.readImmediate(this.operand);
                let result = this.accumulator + memValue;
                this.accumulator = result & 0xFF; // Keep it within 8-bit limit
                break;
            case 0xA2: // LDX 
                this.registerX = this.operand;
                break;
            case 0xAC: // LDY 
                this.registerY = this.mmu.readImmediate(this.operand); // Read the value from memory
                break;
            case 0xA0: // LDY 
                this.registerY = this.operand;
                break;
            case 0x8A: // LXA
                this.accumulator = this.registerX;
                break;
            case 0x98: // LYA
                this.accumulator = this.registerY;
                break;
            case 0xAE: // LDX 
                this.registerX = this.mmu.readImmediate(this.operand);
                break;
            case 0xAA: // TAX - Transfer Accumulator to X
                this.registerX = this.accumulator;
                break;
            case 0xA8: // TAY 
                this.registerY = this.accumulator;
                break;
            case 0xEC: // CPX
                let memoryValue = this.mmu.readImmediate(this.operand);
                if (this.registerX === memoryValue) {
                    this.zFlag = 0x00;
                }
                break;
            case 0xEE: // INC Absolute
                let incrementedValue = (this.mmu.readImmediate(this.operand) + 1) & 0xFF;
                this.mmu.writeImmediate(this.operand, incrementedValue);
                break;
            // chatgpt helped me with this a tad
            case 0xD0: // BNE - Branch if Not Equal
                if (this.zFlag === 0x00) {
                    let offset = this.operand;
                    if (offset > 0x7F) {
                        offset -= 0x100;
                    }
                    this.programCounter += offset;
                }
                break;
            case 0xFF: // System Call
                if (this.registerX === 0x01) {
                    console.log(`System Call: Print Integer ${this.registerY.toString(16)}`);
                }
                else if (this.registerX === 0x02) {
                    let str = this.readStringFromMemory(this.registerY);
                    console.log(`System Call: Print String from Y Register Address - ${str}`);
                }
                else if (this.registerX === 0x03) {
                    // had chatgpt handle this just because I wanted it to figure out
                    // how to decode without the error I was getting before with Ascii.decode(str)
                    let str = this.readStringFromMemory(this.operand);
                    let decodedStr = "";
                    for (let i = 0; i < str.length; i++) {
                        let asciiValue = str.charCodeAt(i);
                        decodedStr += Ascii_1.Ascii.decode(asciiValue);
                    }
                    console.log(`System Call: Print String from Operand Address - ` + decodedStr);
                }
                break;
        }
        this.pipelineStep = 0x04; // Next step: WriteBack
    }
    writeBack(index, value) {
        //Write the OP codes into memory for displaying
        this.mmu.writeImmediate(index, value);
    }
    interruptCheck() {
        this.log("Interrupt check reached");
        let interrupt = this.interruptController.getNextInterrupt();
        if (interrupt) {
            let message = `Interrupt detected - Location: ${interrupt.Name}`;
            if (interrupt instanceof Keyboard_1.Keyboard) {
                let keyboardInputs = interrupt.getInputBuffer();
                message += ` - Keyboard inputs: ${keyboardInputs.join(', ')}`;
                // Clearing the buffer after processing the interrupt
                interrupt.clearInputBuffer();
            }
            this.log(message);
            // Clearing after processes goes to fetch again
            // without this it will add on to the buffer with past "dequeued" 
            // op codes if you do an input again
            this.interruptController.clearInputBuffer();
        }
        else {
            this.log("No interrupt detected");
        }
        this.pipelineStep = 0x00;
    }
    //clock pulse
    pulse() {
        const message = "\treceived clock pulse - [CPU Clock Count " + this.cpuClockCount + "] | PC: " + this.programCounter + " IR: " + this.instructionRegister.toString(16).toUpperCase() + " Acc: " + this.accumulator + " xReg: " + this.registerX + " yReg: " + this.registerY + " zflag: " + this.zFlag + " Step: " + this.pipelineStep;
        this.log(message);
        switch (this.pipelineStep) {
            case 0x00:
                this.fetch();
                this.pipelineStep = 0x01; // Next step: Decode
                break;
            case 0x01:
                this.decode();
                break;
            case 0x02:
                this.highorder();
                break;
            case 0x03:
                this.execute();
                break;
            case 0x04:
                this.writeBack(this.operand, this.accumulator);
                this.pipelineStep = 0x05; // Next step: InterruptCheck
                break;
            case 0x05:
                this.interruptCheck();
                break;
        }
        this.cpuClockCount++;
    }
}
exports.Cpu = Cpu;
//# sourceMappingURL=Cpu.js.map