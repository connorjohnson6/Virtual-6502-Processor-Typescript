import { Cpu } from "./hardware/Cpu";
import { Hardware } from "./hardware/Hardware";
import { Memory } from "./hardware/Memory";
import { Clock } from "./hardware/Clock";
import { Mmu } from "./hardware/Mmu";
import { Keyboard } from "./hardware/Keyboard";
import { InterruptController } from "./hardware/InterruptController";


/*
    Constants
 */
// Initialization Parameters for Hardware
// Clock cycle interval
const CLOCK_INTERVAL= 1000;               // This is in ms (milliseconds) so 1000 = 1 second, 100 = 1/10 second
                                        // A setting of 100 is equivalent to 10hz, 1 would be 1,000hz or 1khz,
                                        // .001 would be 1,000,000 or 1mhz. Obviously you will want to keep this
                                        // small, I recommend a setting of 100, if you want to slow things down
                                        // make it larger.

export class System extends Hardware{

    private clock: Clock;

    constructor(debug: boolean, id: number, name: string) {

        //reads from hardware to asssign global 'super' variable
        super(debug, id, name);
        
        /*
        Start the system (Analogous to pressing the power button and having voltages flow through the components)
        When power is applied to the system clock, it begins sending pulses to all clock observing hardware
        components so they can act on each clock cycle.
         */


    }



    public startSystem(systemInstance: System): boolean {
        
        //thought this would be better since they actually "Start up"
        //when the system starts
        let memory: Memory = new Memory(true, 0, "RAM");
        let cpu: Cpu = new Cpu(true, 0, "CPU");
        let mmu: Mmu = new Mmu(true, 0, "Mmu", memory);
        let clock: Clock = new Clock(true, 0, "CLK");
        let interruptController: InterruptController = new InterruptController(true, 0, "InterruptController");
        let keyboard: Keyboard = new Keyboard(true, 0, "Keyboard", interruptController);


        cpu.setClock(clock)
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

    public stopSystem(): boolean {
        return false;
    }

    public getClock() {
        return this.clock;
    }
}

//creates the instances classes(fulfils the indexs from the super)
let system: System = new System(true, 0, "System");


system.startSystem(system);


