import { Draw } from "../../Draw";

export class Animation {
    public current_state : HTMLImageElement;
    private stateMachine : HTMLImageElement [] = [];

    constructor() {
        this.current_state = Draw.loadImage("textures/img.png");
    }
}