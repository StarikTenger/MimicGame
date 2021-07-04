import * as geom from "./Geom";


export enum Keys {
    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40
}

export class Control {
    private static  keyMapping : Map<number, string[]>;
    private static _keys : boolean[] = [];
    private static clicked = false;
    private static mouseCoordinates = new geom.Vector(0, 0);
    private static commandsCounter : Map<string, number>;
    public static commands : Map<string, boolean>;

    public static load_config(path : string) {
        let file : string[];
        const fs = require('fs');
        fs.readFile(path, function (err, data) {
            if (err) {
                return console.error(err);
            }
            file = data.toString().split("\n");
        });
        let type : string;
        
        for (let i = 0; i < file.length; i++) {
            let currentString = file[i].split(" ");
            type = currentString[0];
            for (let j = 1; j < currentString.length; j++) {
                let currentKey = parseInt(currentString[j]);
                this.keyMapping[currentKey][this.keyMapping[currentKey].length] = type;
            }
        }
    }

    public static init() : void {
        for (let i = 0; i < 256; i++) {
            Control._keys[i] = false;
        }
        window.addEventListener("keydown", Control.onKeyDown);
        window.addEventListener("keyup", Control.onKeyUp);
        window.addEventListener("click", Control.onClick);
        
        console.log("lets do it!!");
        
        this.keyMapping = new Map<number, string[]>();
        this.commandsCounter = new Map<string, number>();
        this.commands = new Map<string, boolean>();
        this.load_config("env/keys.conf");

        console.log("Done!!", this.keyMapping);
    }

    public static isKeyDown(key : Keys) : boolean {
        return Control._keys[key];
    }
S
    public static isMouseClicked() : boolean {
        return this.clicked;
    }

    public static lastMouseCoordinates() : geom.Vector {
        this.clicked = false;
        return this.mouseCoordinates;
    }

    private static onKeyDown(event : KeyboardEvent) : boolean {
        Control._keys[event.keyCode] = true;
        console.log(event.key);
        //if (this.keyMapping != undefined) {
            console.log(event.key);
            for (let i = 0; i < this.keyMapping.get(event.keyCode).length; i++) {
                let currentCommand = this.keyMapping[event.keyCode][i];
                this.commandsCounter[currentCommand]++;
                this.commands[currentCommand] = (this.commandsCounter[currentCommand] != 0);
            }
        //}
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    private static onKeyUp(event : KeyboardEvent) : boolean {
        Control._keys[event.keyCode] = false;
        if (this.keyMapping != undefined) {
            for (let i = 0; i < this.keyMapping[event.keyCode]; i++) {
                let currentCommand = this.keyMapping[event.keyCode][i];
                this.commandsCounter[currentCommand]--;
                this.commands[currentCommand] = (this.commandsCounter[currentCommand] != 0);
            }
        }
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    private static onClick(event : MouseEvent) : boolean {
        Control.clicked = true;
        Control.mouseCoordinates = new geom.Vector(event.x, event.y);
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}