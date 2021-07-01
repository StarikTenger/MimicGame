import { Game } from "./Game";
import { Control, Keys } from "./Control";
import * as geom from "./Geom";
import { Entity } from "./Entity";
import { Camera } from "./Draw";

export class Brain {
    public personID : number;
    public game : Game;
    
    constructor(game : Game, personID : number) {
        this.game = game;
        this.personID = personID;
    }

    public bodyControl() {
        if (this.personID == this.game.playerID) {
            let vel = 0.01;
            if(Control.isKeyDown(Keys.UpArrow)) {
                this.game.entities[this.personID].body.move(new geom.Vector(0, -vel));
            }
            if(Control.isKeyDown(Keys.DownArrow)) {
                this.game.entities[this.personID].body.move(new geom.Vector(0, vel));
            }
            if(Control.isKeyDown(Keys.RightArrow)) {
                this.game.entities[this.personID].body.move(new geom.Vector(vel, 0));
            }
            if(Control.isKeyDown(Keys.LeftArrow)) {
               this.game.entities[this.personID].body.move(new geom.Vector(-vel, 0));
            }
            if(Control.isMouseClicked()) {
                //console.log("clicked", this.game.draw.cam.center, this.game.draw.cam.pos, this.game.draw.cam.scale);
                let coords = new geom.Vector(Control.lastMouseCoordinates().x / this.game.draw.cam.scale,
                Control.lastMouseCoordinates().y / this.game.draw.cam.scale);
                //console.log(this.game.draw.cam.center.mul(1.0 / this.game.draw.cam.scale));
                coords = coords.sub(this.game.draw.cam.center.mul(1.0 / this.game.draw.cam.scale));
                let infectionRadius = 100;
                for (let i = 0; i < this.game.entities.length; i++) {
                    let centerDistance = this.game.entities[this.personID].body.center.sub(this.game.entities[i].body.center).abs();
                    let isMouseOn = this.game.entities[i].body.center.sub(coords).abs();
                    //console.log("cords: ", coords, "isMouseOn: ", isMouseOn, "MyCenter: ", this.game.people[this.personID].body.center);
                    if ((centerDistance < infectionRadius) && (isMouseOn < this.game.entities[i].body.radius) && (i != this.personID)) {
                        this.game.playerID = i;
                        break;
                    }
                }
            }
        }
        else {
            // TODO: AI control
        }
    }
}