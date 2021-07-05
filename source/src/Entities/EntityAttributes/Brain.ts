import { Game } from "../../Game";
import { Control, Keys } from "../../Control";
import * as geom from "../../Geom";
import { Entity } from "../Entity";
import { Camera } from "../../Draw";

export class Brain {
    public entityID : number;
    public game : Game;
    private AIcommands : Map<string, boolean>;
    public commands : Map<string, boolean>;
    
    constructor(game : Game, entityID : number) {
        this.game = game;
        this.entityID = entityID;
        this.AIcommands = new Map<string, boolean>();
        this.commands = this.AIcommands;
    }

    public AIcontrol() {
        this.commands = this.AIcommands;
    }

    public PlayerControl() {
        this.commands = Control.commands;
    }

    public step() {
        let vel = this.game.entities[this.entityID].body.velocity;
        if(this.commands["MoveUp"]) {
            this.game.entities[this.entityID].body.move(new geom.Vector(0, -vel));
        }
        if(this.commands["MoveDown"]) {
            this.game.entities[this.entityID].body.move(new geom.Vector(0, vel));
        }
        if(this.commands["MoveRight"]) {
            this.game.entities[this.entityID].body.move(new geom.Vector(vel, 0));
        }
        if(this.commands["MoveLeft"]) {
            this.game.entities[this.entityID].body.move(new geom.Vector(-vel, 0));
        }   
    }
}