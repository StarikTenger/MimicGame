import * as geom from "./Geom";
import { Brain } from "./Brain";
import { Body } from "./Body";
import { Animation } from "./Animation";

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