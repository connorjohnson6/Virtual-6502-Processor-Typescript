import { Hardware } from "./Hardware";
import { Interrupt } from "./Interrupt";

export class InterruptController extends Hardware {
    //hold the queue of interrupts.
    private interruptQueue: Interrupt[] = [];
    
    // Map to keep track of devices registered with their interrupt numbers.
    private registeredDevices: Map<number, Interrupt> = new Map();

    constructor(debug: boolean, id: number, name: string) {
        super(debug, id, name);
    }

    // give an interrupt an interrupt number.
    public registerDevice(device: Interrupt): void {
        this.registeredDevices.set(device.IRQNum, device);
    }

    // Accept and add it to the interrupt queue.
    // The queue is sorted based on the priority of the interrupts.
    public acceptInterrupt(interrupt: Interrupt): void {
        this.interruptQueue.push(interrupt);
        this.interruptQueue.sort((a, b) => a.priority - b.priority);
    }

    // Returns the first interrupt from the queue / null if the queue is empty.
    public getNextInterrupt(): Interrupt | null {
        return this.interruptQueue.shift() || null;
    }

    public clearInputBuffer(): void {
        this.interruptQueue = [];
    }
    
}
