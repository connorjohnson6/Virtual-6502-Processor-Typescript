//create the interface 
export interface ClockListener{
    // Notify all clock attached hardware when a pulse occurs
    pulse() : void
}