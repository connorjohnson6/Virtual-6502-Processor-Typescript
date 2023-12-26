import { Hardware } from "./Hardware";
  import { Interrupt } from "./Interrupt";
import { InterruptController } from "./InterruptController";

export class Keyboard extends Hardware implements Interrupt {


    public IRQNum: number;
    public priority: number;
    public Name: string;
    public inputBuffer: string[];  // Changed to string[] for simplicity
    public outputBuffer: string[];
    public interruptController: InterruptController;

    constructor(debug: boolean, id: number, name: string, interruptController: InterruptController) {
        super(debug, id, name);
        this.IRQNum = 1;
        this.priority = 1;
        this.Name = name;
        this.inputBuffer = [];
        this.outputBuffer = [];
        this.interruptController = interruptController;

        this.monitorKeys();
    }

    handleInput(input: any): void {
        // Implementation for handling input
        // can't lie, just really used an array but used it like a queue so I guess it counts
        this.inputBuffer.push(input);
    }

    handleOutput(): any {
        // method so it stopd bitchn at me
    }

    public getInputBuffer(): string[] {
        return this.inputBuffer;
    }

    clearInputBuffer() {
        this.inputBuffer = [];
    }
    
    

    private monitorKeys() {
        /*
        character stream from stdin code (most of the contents of this function) taken from here
        https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin

        This takes care of the simulation we need to do to capture stdin from the console and retrieve the character.
        Then we can put it in the buffer and trigger the interrupt.
         */
        var stdin = process.stdin;

        // without this, we would only get streams once enter is pressed
        stdin.setRawMode( true );

        // resume stdin in the parent process (node app won't quit all by itself
        // unless an error or process.exit() happens)
        stdin.resume();

        // i don't want binary, do you?
        //stdin.setEncoding( 'utf8' );
        stdin.setEncoding(null);


        stdin.on( 'data', function( key ){
            //let keyPressed : String = key.charCodeAt(0).toString(2);
            //while(keyPressed.length < 8) keyPressed = "0" + keyPressed;
            let keyPressed: String = key.toString();

            this.log("Key pressed - " + keyPressed);

            // ctrl-c ( end of text )
            // this let's us break out with ctrl-c
            if ( key.toString() === '\u0003' ) {
                process.exit();
            }

            // write the key to stdout all normal like
            //process.stdout.write( key);
            // put the key value in the buffer

            //kept getting that enqueue wasn't a method so I changed it
            this.handleInput(keyPressed);

            // set the interrupt!
            this.interruptController.acceptInterrupt(this);

            // .bind(this) is required when running an asynchronous process in node that wishes to reference an
            // instance of an object.
        }.bind(this));
    }
}
