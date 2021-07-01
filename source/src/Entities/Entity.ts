import * as geom from "../Geom";
import { Brain } from "./EntityAttributes/Brain";
import { Body } from "./EntityAttributes/Body";
import { Animation } from "./EntityAttributes/Animation";

export class Entity {
    public body : Body;
    public brain : Brain;
    public animation : Animation;
    
    constructor(body : Body, brain : Brain) {
        this.brain = brain;
        this.body = body;
        this.animation = new Animation();
    }
}