import { Hardware } from "./Hardware";

export class Ascii extends Hardware {
    constructor(debug: boolean, id: number, name: string){
        super(debug, id, name);
    }

    // Decode from ASCII value to character
    public static decode(value: number): string {
        switch (value) {
            case 0x41: return 'A';
            case 0x42: return 'B';
            case 0x43: return 'C';
            case 0x44: return 'D';
            case 0x45: return 'E';
            case 0x46: return 'F';
            case 0x47: return 'G';
            case 0x48: return 'H';
            case 0x49: return 'I';
            case 0x4A: return 'J';
            case 0x4B: return 'K';
            case 0x4C: return 'L';
            case 0x4D: return 'M';
            case 0x4E: return 'N';
            case 0x4F: return 'O';
            case 0x50: return 'P';
            case 0x51: return 'Q';
            case 0x52: return 'R';
            case 0x53: return 'S';
            case 0x54: return 'T';
            case 0x55: return 'U';
            case 0x56: return 'V';
            case 0x57: return 'W';
            case 0x58: return 'X';
            case 0x59: return 'Y';
            case 0x5A: return 'Z';


            case 0x61: return 'a';
            case 0x62: return 'b';
            case 0x63: return 'c';
            case 0x64: return 'd';
            case 0x65: return 'e';
            case 0x66: return 'f';
            case 0x67: return 'g';
            case 0x68: return 'h';
            case 0x69: return 'i';
            case 0x6A: return 'j';
            case 0x6B: return 'k';
            case 0x6C: return 'l';
            case 0x6D: return 'm';
            case 0x6E: return 'n';
            case 0x6F: return 'o';
            case 0x70: return 'p';
            case 0x71: return 'q';
            case 0x72: return 'r';
            case 0x73: return 's';
            case 0x74: return 't';
            case 0x75: return 'u';
            case 0x76: return 'v';
            case 0x77: return 'w';
            case 0x78: return 'x';
            case 0x79: return 'y';
            case 0x7A: return 'z';


            case 0x30: return '0';
            case 0x31: return '1';
            case 0x32: return '2';
            case 0x33: return '3';
            case 0x34: return '4';
            case 0x35: return '5';
            case 0x36: return '6';
            case 0x37: return '7';
            case 0x38: return '8';
            case 0x39: return '9';


            case 0x20: return ' ';
            case 0x2E: return '.';
            case 0x2D: return '-';
            case 0x21: return '!';
            case 0x2C: return ',';


            case 0x0A: return '\n'; // New line
            case 0x0D: return '\r'; // return

            default: return '?'; // Unknown character
        }
    }

    // Encode from character to ASCII value
    public static encode(char: string): number {
        switch (char) {
            case 'A': return 0x41;
            case 'B': return 0x42;
            case 'C': return 0x43;
            case 'D': return 0x44;
            case 'E': return 0x45;
            case 'F': return 0x46;
            case 'G': return 0x47;
            case 'H': return 0x48;
            case 'I': return 0x49;
            case 'J': return 0x4A;
            case 'K': return 0x4B;
            case 'L': return 0x4C;
            case 'M': return 0x4D;
            case 'N': return 0x4E;
            case 'O': return 0x4F;
            case 'P': return 0x50;
            case 'Q': return 0x51;
            case 'R': return 0x52;
            case 'S': return 0x53;
            case 'T': return 0x54;
            case 'U': return 0x55;
            case 'V': return 0x56;
            case 'W': return 0x57;
            case 'X': return 0x58;
            case 'Y': return 0x59;
            case 'Z': return 0x5A;


            case 'a': return 0x61;
            case 'b': return 0x62;
            case 'c': return 0x63;
            case 'd': return 0x64;
            case 'e': return 0x65;
            case 'f': return 0x66;
            case 'g': return 0x67;
            case 'h': return 0x68;
            case 'i': return 0x69;
            case 'j': return 0x6A;
            case 'k': return 0x6B;
            case 'l': return 0x6C;
            case 'm': return 0x6D;
            case 'n': return 0x6E;
            case 'o': return 0x6F;
            case 'p': return 0x70;
            case 'q': return 0x71;
            case 'r': return 0x72;
            case 's': return 0x73;
            case 't': return 0x74;
            case 'u': return 0x75;
            case 'v': return 0x76;
            case 'w': return 0x77;
            case 'x': return 0x78;
            case 'y': return 0x79;
            case 'z': return 0x7A;


            case '0': return 0x30;
            case '1': return 0x31;
            case '2': return 0x32;
            case '3': return 0x33;
            case '4': return 0x34;
            case '5': return 0x35;
            case '6': return 0x36;
            case '7': return 0x37;
            case '8': return 0x38;
            case '9': return 0x39;


            case ' ': return 0x20;
            case '.': return 0x2E;
            case '-': return 0x2D;
            case '!': return 0x21;
            case ',': return 0x2C;


            case '\n': return 0x0A; // New line
            case '\r': return 0x0D; // Carriage return

            default: return 0x3F; // '?'
        }
    }
}
