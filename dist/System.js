"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const Cpu_1 = require("./hardware/Cpu");
const Hardware_1 = require("./hardware/Hardware");
const Memory_1 = require("./hardware/Memory");
const Clock_1 = require("./hardware/Clock");
const Mmu_1 = require("./hardware/Mmu");
const Keyboard_1 = require("./hardware/Keyboard");
const InterruptController_1 = require("./hardware/InterruptController");
/*
    Constants
 */
// Initialization Parameters for Hardware
// Clock cycle interval
const CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second, 100 = 1/10 second
// A setting of 100 is equivalent to 10hz, 1 would be 1,000hz or 1khz,
// .001 would be 1,000,000 or 1mhz. Obviously you will want to keep this
// small, I recommend a setting of 100, if you want to slow things down
// make it larger.
class System extends Hardware_1.Hardware {
    constructor(debug, id, name) {
        //reads from hardware to asssign global 'super' variable
        super(debug, id, name);
        /*
        Start the system (Analogous to pressing the power button and having voltages flow through the components)
        When power is applied to the system clock, it begins sending pulses to all clock observing hardware
        components so they can act on each clock cycle.
         */
    }
    startSystem(systemInstance) {
        //thought this would be better since they actually "Start up"
        //when the system starts
        let memory = new Memory_1.Memory(true, 0, "RAM");
        let cpu = new Cpu_1.Cpu(true, 0, "CPU");
        let mmu = new Mmu_1.Mmu(true, 0, "Mmu", memory);
        let clock = new Clock_1.Clock(true, 0, "CLK");
        let interruptController = new InterruptController_1.InterruptController(true, 0, "InterruptController");
        let keyboard = new Keyboard_1.Keyboard(true, 0, "Keyboard", interruptController);
        cpu.setClock(clock);
        interruptController.registerDevice(keyboard);
        cpu.interruptController = interruptController;
        //call log from its respective hardware instance
        systemInstance.log(" created");
        cpu.setMmu(mmu);
        cpu.log(" created");
        memory.initializeMemory(); //must be called before displayMemory
        mmu.writeStatic();
        //initialize clock instance to start log pulse      
        clock.initializeClock();
        clock.startClock(CLOCK_INTERVAL);
        //must add the listener to get the clock pulse
        clock.addListener(cpu);
        clock.addListener(memory);
        //clock.addListener(keyboard);
        return true;
    }
    stopSystem() {
        return false;
    }
    getClock() {
        return this.clock;
    }
}
exports.System = System;
//creates the instances classes(fulfils the indexs from the super)
let system = new System(true, 0, "System");
system.startSystem(system);
//# sourceMappingURL=System.js.map