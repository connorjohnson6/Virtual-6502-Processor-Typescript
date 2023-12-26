import { Hardware } from "./Hardware";
import { ClockListener } from "./imp/ClockListener";


export class Memory extends Hardware implements ClockListener{
    
    private _MEMORY_SIZE: number = 0xFFFF; // 65536, 16-bit address space

    private _memory: Uint8Array; // Represents the memory array with 8-bit values
    private _mar: number; // Memory Address Register, holds the current address
    private _mdr: number; // Memory Data Register, holds the current data

    constructor(debug: boolean, id: number, name: string) {
        super(debug, id, name);
        this._memory = new Uint8Array(this._MEMORY_SIZE);
        this._mar = 0;
        this._mdr = 0;
    }

    // Initializes the memory array to 0 and logs the addressable space
    public initializeMemory(): void {
        this._memory.fill(0);
        this.log(`Created - Addressable space: ${this._MEMORY_SIZE}`);
        
    }

    // Resets the memory array and registers to 0
    public reset(): void {
        this._memory.fill(0);
        this._mar = 0;
        this._mdr = 0;
    }

    //just logs a statement
    public pulse(): void {
        this.log(`\treceived clock pulse`);
    }

    // Getters and Setters for MAR and MDR
    public getMAR(): number {
        return this._mar;
    }

    public setMAR(value: number) {
        if (value < 0 || value >= this._MEMORY_SIZE) {
            throw new Error("Invalid MAR value");
        }
        this._mar = value;
    }

    public getMDR(): number {
        return this._mdr;
    }

    public setMDR(value: number) {
        if (value < 0 || value > 0xFF) {
            throw new Error("Invalid MDR value");
        }
        this._mdr = value;
    }

    // Reads a byte from the memory at the address in MAR and updates MDR
    public read(): void {
        this.setMDR(this._memory[this.getMAR()]);
    }

    // Writes the byte in MDR to the memory at the address in MAR
    public write(): void {
        this._memory[this.getMAR()] = this.getMDR();
    }

    public getSize(): number {
        return this._MEMORY_SIZE
    }

}
