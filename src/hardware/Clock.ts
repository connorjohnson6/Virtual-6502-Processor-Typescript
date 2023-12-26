import { ClockListener } from "./imp/ClockListener";
import { Hardware } from "./Hardware";
import { clear } from "console";



export class Clock extends Hardware implements ClockListener {

    //vvv chatGPT helped me with this one vvv
    private _intervalId?: NodeJS.Timeout;  // To store the ID of the interval, which will allow us to clear it later if needed. ? = optional
    private _listeners: ClockListener[] = [];


    constructor(debug: boolean ,id: number, name: string) {
        super(debug, id, name);
    }

    public addListener(listener: ClockListener): void {
        this._listeners.push(listener);
    }

    public initializeClock(): void {
        const message = "\tClock Pulse Initialized";

        
        // Send pulse to all listeners (.addListener Cpu and Memory)
        for (const listener of this._listeners) {
            listener.pulse();
        }

        this.log(message);
    }

    public startClock(CLOCK_INTERVAL): void {
        // If there's an existing interval, clear it first
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
        this._intervalId = setInterval(this.initializeClock.bind(this), CLOCK_INTERVAL);
    }

    public stopClock(): void {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = undefined; // Clear the interval ID after stopping the clock
            this.log("Clock Pulse Stopped");
        } else {
            this.log("Clock Pulse was not running");
        }
    }


    //only added this bc the clock was being bitchy due to the implement ClockListener
    pulse(): void {
        throw new Error("Method not implemented.");
    }

}




