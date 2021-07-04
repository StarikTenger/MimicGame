import * as geom from "../../Geom";
import { Game } from "../../Game";
import {Tile, CollisionType} from "../../Tile";

export class Body {
    public center : geom.Vector;
    public radius : number;
    public game : Game;
    public velocity = 0.01

    constructor(center : geom.Vector, radius:number) {
        this.center = center;
        this.radius = radius;
    }
    
    public move(delta : geom.Vector) {        
        let collision = this.game.check_wall(this.center.add(delta));
        if (collision == CollisionType.Full)
            delta = new geom.Vector();
        else if (collision != CollisionType.Empty){
            let norm : geom.Vector;
            if (collision == CollisionType.CornerDL) norm = new geom.Vector(1, -1);
            if (collision == CollisionType.CornerDR) norm = new geom.Vector(-1, -1);
            if (collision == CollisionType.CornerUL) norm = new geom.Vector(1, 1);
            if (collision == CollisionType.CornerUR) norm = new geom.Vector(-1, 1);
            delta = delta.sub(norm.mul(delta.dot(norm) / norm.dot(norm))).add(norm.mul(1/10000));
        }
        let posNew = this.center.add(delta);
        this.center = posNew;
    }
}