import { Game } from "./Game";
import * as geom from "./Geom"
import { Control, Keys } from "./Control";

export class Mimic {
    public currentID = 0;
    public infectionRadius = 100;
    public game : Game;

    constructor(game : Game) {
        this.game = game;
    }

    public takeControl(newID : number) {
        this.game.entities[this.currentID].brain.AIcontrol();
        this.game.playerID = newID;
        this.currentID = newID;
        this.game.entities[this.currentID].brain.PlayerControl();
    }

    public step() {
        if(Control.isMouseClicked()) {
            //console.log("clicked", this.game.draw.cam.center, this.game.draw.cam.pos, this.game.draw.cam.scale);
            let coords = new geom.Vector(Control.lastMouseCoordinates().x / this.game.draw.cam.scale,
            Control.lastMouseCoordinates().y / this.game.draw.cam.scale);
            //console.log(this.game.draw.cam.center.mul(1.0 / this.game.draw.cam.scale));
            coords = coords.sub(this.game.draw.cam.center.mul(1.0 / this.game.draw.cam.scale));
            for (let i = 0; i < this.game.entities.length; i++) {
                let centerDistance = this.game.entities[this.currentID].body.center.sub(this.game.entities[i].body.center).abs();
                let isMouseOn = this.game.entities[i].body.center.sub(coords).abs();
                //console.log("cords: ", coords, "isMouseOn: ", isMouseOn, "MyCenter: ", this.game.people[this.personID].body.center);
                if ((centerDistance < this.infectionRadius) && (isMouseOn < this.game.entities[i].body.radius) && (i != this.currentID)) {
                    this.takeControl(i);   
                    break;
                }
            }
        }
    }
}