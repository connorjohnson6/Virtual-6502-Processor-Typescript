"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hardware = void 0;
class Hardware {
    constructor(debug, id, name) {
        this._Debug = debug;
        this._IDnumber = id;
        this._Name = name;
    }
    log(string) {
        //grabs the long date that Gorm randomly wants
        const timeStamp = new Date().getTime();
        //creates the message
        const message = "[HW - " + this._Name + " id: " + this._IDnumber + " - " + timeStamp + "]: " + string;
        //needs to have the debug = true
        if (this._Debug) {
            console.log(message);
        }
    }
    hexLog(value, length) {
        // Check for NaN since TypeScript won't catch this at compile-time
        //Not a number: incase you were curious 
        if (isNaN(value)) {
            return "ERR [hexValue conversion]: Invalid number";
        }
        //will now display using hex string
        let hexValue = value.toString(16).toUpperCase();
        // put in additional zeros for length
        //can delete later if not right
        while (hexValue.length < length) {
            hexValue = '0' + hexValue;
        }
        return "0x" + hexValue;
    }
}
exports.Hardware = Hardware;
//# sourceMappingURL=Hardware.js.map