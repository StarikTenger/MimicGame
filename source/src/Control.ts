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

    public static loadConfig(path : string) {
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
                Control.keyMapping[currentKey][Control.keyMapping[currentKey].length] = type;
            }
            Control.commands[type] = false;
        }
    }
    
    public static fakeLoadConfig() {
        Control.keyMapping[38] = [];
        Control.keyMapping[38][0] = "MoveUp";
        Control.commandsCounter["MoveUp"] = 0;
        Control.commands["MoveUp"] = false;
        Control.keyMapping[40] = [];
        Control.keyMapping[40][0] = "MoveDown";
        Control.commandsCounter["MoveDown"] = 0;
        Control.commands["MoveDown"] = false;
        Control.keyMapping[39] = [];
        Control.keyMapping[39][0] = "MoveRight";
        Control.commandsCounter["MoveRight"] = 0;
        Control.commands["MoveRight"] = false;
        Control.keyMapping[37] = [];
        Control.keyMapping[37][0] = "MoveLeft";
        Control.commandsCounter["MoveLeft"] = 0;
        Control.commands["MoveLeft"] = false;
    }

    public static init() : void {
        for (let i = 0; i < 256; i++) {
            Control._keys[i] = false;
        }
        window.addEventListener("keydown", Control.onKeyDown);
        window.addEventListener("keyup", Control.onKeyUp);
        window.addEventListener("click", Control.onClick);
        
        console.log("lets do it!!");
        
        Control.keyMapping = new Map<number, string[]>();
        Control.commandsCounter = new Map<string, number>();
        Control.commands = new Map<string, boolean>();
        //Control.loadConfig("env/keys.conf");
        Control.fakeLoadConfig();

        console.log("Done!!", Control.keyMapping);
        console.log(Control.commands["MoveUp"]);
        console.log(Control.commands);
        
    }

    public static isKeyDown(key : Keys) : boolean {
        return Control._keys[key];
    }
S
    public static isMouseClicked() : boolean {
        return Control.clicked;
    }

    public static lastMouseCoordinates() : geom.Vector {
        Control.clicked = false;
        return Control.mouseCoordinates;
    }

    private static onKeyDown(event : KeyboardEvent) : boolean {
        if (Control.keyMapping != undefined && Control._keys[event.keyCode] == false) {
            console.log(event.key, Control.keyMapping, Control.keyMapping[event.keyCode]);
            if (Control.keyMapping[event.keyCode] == undefined) {
                Control.keyMapping[event.keyCode] = [];
            }
            for (let i = 0; i < Control.keyMapping[event.keyCode].length; i++) {
                let currentCommand = Control.keyMapping[event.keyCode][i];
                Control.commandsCounter[currentCommand]++;
                Control.commands[currentCommand] = (Control.commandsCounter[currentCommand] != 0);
                console.log(currentCommand, Control.commandsCounter[currentCommand], Control.commands[currentCommand]);
            }
        }
        Control._keys[event.keyCode] = true;
        console.log(event.key);
        console.log(Control.commandsCounter);
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    private static onKeyUp(event : KeyboardEvent) : boolean {
        if (Control.keyMapping != undefined && Control._keys[event.keyCode] == true) {
            if (Control.keyMapping[event.keyCode] == undefined) {
                Control.keyMapping[event.keyCode] = [];
            }
            for (let i = 0; i < Control.keyMapping[event.keyCode].length; i++) {
                let currentCommand = Control.keyMapping[event.keyCode][i];
                Control.commandsCounter[currentCommand]--;
                Control.commands[currentCommand] = (Control.commandsCounter[currentCommand] != 0);
            }
        }
        Control._keys[event.keyCode] = false;
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