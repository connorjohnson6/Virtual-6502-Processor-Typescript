import { Hardware } from "./Hardware";
import { Memory } from "./Memory";


export class Mmu extends Hardware {
    private _memory: Memory;
    

    constructor(debug: boolean, id: number, name: string, memoryInstance: Memory) {
        super(debug, id, name);

        this._memory = memoryInstance;

    }

    public powerProgram(): void {
        // load constant 0
        this.writeImmediate(0x0000, 0xA9);
        this.writeImmediate(0x0001, 0x00);
        // write acc (0) to 0040
        this.writeImmediate(0x0002, 0x8D);
        this.writeImmediate(0x0003, 0x40);
        this.writeImmediate(0x0004, 0x00);
        // load constant 1
        this.writeImmediate(0x0005, 0xA9);
        this.writeImmediate(0x0006, 0x01);
        // add acc (?) to mem 0040 (?)
        this.writeImmediate(0x0007, 0x6D);
        this.writeImmediate(0x0008, 0x40);
        this.writeImmediate(0x0009, 0x00);
        // write acc ? to 0040
        this.writeImmediate(0x000A, 0x8D);
        this.writeImmediate(0x000B, 0x40);
        this.writeImmediate(0x000C, 0x00);
        // Load y from memory 0040
        this.writeImmediate(0x000D, 0xAC);
        this.writeImmediate(0x000E, 0x40);
        this.writeImmediate(0x000F, 0x00);
        // Load x with constant (1) (to make the first system call)
        this.writeImmediate(0x0010, 0xA2);
        this.writeImmediate(0x0011, 0x01);
        // make the system call to print the value in the y register (3)
        this.writeImmediate(0x0012, 0xFF);
        // Load x with constant (3) (to make the second system call for the string)
        this.writeImmediate(0x0013, 0xA2);
        this.writeImmediate(0x0014, 0x03);
        // make the system call to print the value in the y register (3)
        this.writeImmediate(0x0015, 0xFF);
        this.writeImmediate(0x0016, 0x50);
        this.writeImmediate(0x0017, 0x00);
        // test DO (Branch Not Equal) will be NE and branch (0x0021 contains 0x20 and xReg contains B2)
        this.writeImmediate(0x0018, 0xD0);
        this.writeImmediate(0x0019, 0xED);
        // globals
        this.writeImmediate(0x0050, 0x2C);
        this.writeImmediate(0x0052, 0x00);

        this.memoryDump(0x0000, 0x001A);
        this.log("---------------------------")
        this.memoryDump(0x0050, 0x0053);
    }

    public systemCallProgram(): void {
        
        // load constant 3
        this.writeImmediate(0x0000, 0xA9);
        // for some reason if I change the 0x0A operand, it determines on how long the program will
        // run for, So if its 0x0A like origionally, the program will shit
        // itself at the first FF OP code, but change it to 0x5E, and then the 
        // hello world! will log itself
        // I showed you this in class Nov. 30th
        this.writeImmediate(0x0001, 0x5E);
        // write acc (3) to 0040
        this.writeImmediate(0x0002, 0x8D);
        this.writeImmediate(0x0003, 0x40);
        this.writeImmediate(0x0004, 0x00);
        // :loop
        // Load y from memory (3)
        this.writeImmediate(0x0005, 0xAC);
        this.writeImmediate(0x0006, 0x40);
        this.writeImmediate(0x0007, 0x00);
        // Load x with constant (1) (to make the first system call)
        this.writeImmediate(0x0008, 0xA2);
        this.writeImmediate(0x0009, 0x01);
        // make the system call to print the value in the y register (3)
        this.writeImmediate(0x000A, 0xFF);
        // Load x with constant (3) (to make the second system call for the string)
        this.writeImmediate(0x000B, 0xA2);
        this.writeImmediate(0x000C, 0x03);
        // make the system call to print the value in the y register (3)
        this.writeImmediate(0x000D, 0xFF);
        this.writeImmediate(0x000E, 0x50);
        this.writeImmediate(0x000F, 0x00);

        // load the string
        // 0A 48 65 6c 6c 6f 20 57 6f 72 6c 64 21
        this.writeImmediate(0x0050, 0x0A);
        this.writeImmediate(0x0051, 0x48);
        this.writeImmediate(0x0052, 0x65);
        this.writeImmediate(0x0053, 0x6C);
        this.writeImmediate(0x0054, 0x6C);
        this.writeImmediate(0x0055, 0x6F);
        this.writeImmediate(0x0056, 0x20);
        this.writeImmediate(0x0057, 0x57);
        this.writeImmediate(0x0058, 0x6F);
        this.writeImmediate(0x0059, 0x72);
        this.writeImmediate(0x005A, 0x6C);
        this.writeImmediate(0x005B, 0x64);
        this.writeImmediate(0x005C, 0x21);
        this.writeImmediate(0x005D, 0x0A);
        this.writeImmediate(0x005E, 0x00);

        this.memoryDump(0x0000, 0x0010);
        this.log("---------------------------")
        this.memoryDump(0x0040, 0x0043);
        this.log("---------------------------")
        this.memoryDump(0x0050, 0x005C);

    }

    public writeStatic():void{

        this.powerProgram();
        //this.systemCallProgram();

    } 

//Setters and getters from the Memory.ts file
    public setMARCall(marNum: number): void {
        if (marNum < 0 || marNum >= this._memory.getSize()) {
            throw new Error("Invalid MAR value");
        }
        this._memory.setMAR(marNum);
    }

    public setMDRCall(mdrNum: number): void {
        if (mdrNum < 0 || mdrNum > 0xFF) {
            throw new Error("Invalid MDR value");
        }
        this._memory.setMDR(mdrNum);
    }
    

    public getMDRCall(): number {
        return this._memory.getMDR();
    }

    public getMARCall(): number {
        return this._memory.getMAR();
    }

    public readCall(): void{
        this._memory.read();
    }

    public writeCall(): void{
        this._memory.write();
    }

    //Psuedo setters of little endian format
    public setLowByte(value: number): number {
        // low byte = first byte.
        // isolate the low byte from a 16-bit number.
        // Return the least significant byte (low byte) of the value.
        return value & 0xFF;
    }
    
    public setHighByte(value: number): number {
        // isolate the high byte from a 16-bit number.
        // Return the most significant byte (high byte) by shifting the value right 8 bits.
        return (value >> 8) & 0xFF;
    }
    
    // Combine into little-endian format.
    public setLittleEndianValue(highByte: number, lowByte: number): number {
        // Shift the high byte left by 8 bits and combine it with the low byte.
        return (highByte << 8) | lowByte;
    }

    //Immediates for static op codes given
    public readImmediate(index: number): number {
        // Set Memory Address Register to the current index
        this.setMARCall(index);
        //Read the value to memory
        this.readCall(); 

        // Get the value from the Memory Data Register
        return this.getMDRCall();

    }

    public writeImmediate(index: number, value: number): void{
        // Set Memory Address Register to the current index
            this.setMARCall(index);
        // Set Memory Data Register to the current data value
            this.setMDRCall(value); 
        // Write the value to memory
            this.writeCall(); 
    
    }
    
    //mine used to be memoryDisplay, but I thought that keeping it universal would be better
    public memoryDump(startAddress: number , endAddress: number ): void {

        this.log(" Initialized Memory")
        this.log(" Memory Dump: Debug")
        this.log(" --------------------------------------")
        
        for (let address = startAddress; address <= endAddress; address++) {

            this.setMARCall(address);
            //this.readCall();
            this.readImmediate(address);
            let value = this.getMDRCall();


            this.log(`Addr ${this.hexLog(address, 4)}: | ${this.hexLog(value, 2)}`);
        }
        
        this.log(" --------------------------------------");
        this.log(" Memory Dump: Complete");
    }


}