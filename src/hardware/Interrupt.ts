export interface Interrupt {
    inputBuffer: any;
    IRQNum: number;
    priority: number;
    Name: string;
    handleInput(input: any): void;
    handleOutput(): any;
}
