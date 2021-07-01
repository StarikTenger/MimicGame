import * as geom from "./Geom";
import { Map } from "./AuxLib";

export enum Keys {
    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40
}

export class Control {
    private static _keys : boolean[] = [];
    private static clicked = false;
    private static mouseCoordinates = new geom.Vector(0, 0);
    public static commands : Map;

    public static init() : void {
        for (let i = 0; i < 256; i++) {
            Control._keys[i] = false;
        }

        window.addEventListener("keydown", Control.onKeyDown);
        window.addEventListener("keyup", Control.onKeyUp);
        window.addEventListener("click", Control.onClick);
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
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    private static onKeyUp(event : KeyboardEvent) : boolean {
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