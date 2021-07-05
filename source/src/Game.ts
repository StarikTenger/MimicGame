import * as geom from "./Geom";
import {Body} from "./Entities/EntityAttributes/Body";
import {Entity} from "./Entities/Entity";
import {Control, Keys} from "./Control";
import {Draw, Color} from "./Draw";
import { Tile, CollisionType } from "./Tile";
import { Brain } from "./Entities/EntityAttributes/Brain";
import { Mimic } from "./Mimic";

export class Game {
    public tileSize = 1
    public draw : Draw;
    private bodies : Body [] = [];
    private brains : Brain [] = [];
    public entities : Entity [] = [];
    public grid : Tile [][] = [];
    public playerID = 0;
    public mimic : Mimic

    constructor(draw : Draw) {
        console.log("im here!!");
        
        Control.init();
        this.draw = draw;

        let sizeX = 10;
        let sizeY = 10;
        for (let x = 0; x < sizeX; x++) {
            this.grid[x] = [];
            for (let y = 0; y < sizeY; y++) {
                this.grid[x][y] = new Tile();
            }
        }

        this.mimic = new Mimic(this);

        this.grid[0][0] = new Tile(CollisionType.CornerDR);
        this.grid[1][1] = new Tile(CollisionType.CornerUL);
        this.grid[0][1] = new Tile(CollisionType.CornerUR);
        this.grid[1][0] = new Tile(CollisionType.CornerDL);
    }

    public make_body(coordinates : geom.Vector, radius : number) : Body {
        let body = new Body(coordinates, radius);
        body.game = this;
        return this.bodies[this.bodies.length] = body;
    }

    public make_brain() {
        let brain = new Brain(this, this.brains.length);
        return this.brains[this.brains.length] = brain;
    }

    public make_person(body : Body, brain : Brain) {
        return this.entities[this.entities.length] = new Entity(body, brain);
    }

    public step() {
        this.mimic.step();
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].brain.step();
        }
    }

    // Checks if pos is in wall
    public check_wall(pos : geom.Vector) : number {
        let posRound = new geom.Vector(
            Math.floor(pos.x / this.tileSize), 
            Math.floor(pos.y / this.tileSize)
        );

        // If out of bounds
        if (posRound.x < 0 || posRound.y < 0 || 
            posRound.x >= this.grid.length || 
            posRound.y >= this.grid[0].length)
            return 0;

        let collisionType = this.grid[posRound.x][posRound.y].colision;    
        // Coordinates in particular grid cell
        let posIn = pos.sub(posRound.mul(this.tileSize)).mul(1 / this.tileSize);
        // Different collision types
        if (collisionType == CollisionType.Full ||
            collisionType == CollisionType.CornerUR && posIn.y < posIn.x ||
            collisionType == CollisionType.CornerDL && posIn.y > posIn.x ||
            collisionType == CollisionType.CornerDR && posIn.y > 1 - posIn.x ||
            collisionType == CollisionType.CornerUL && posIn.y < 1 - posIn.x
            )
            return collisionType;
        return CollisionType.Empty;
    }

    public display() {
        this.draw.cam.pos = new geom.Vector(0, 0);
        this.draw.cam.scale = 100;
        // Tiles
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                let size = new geom.Vector(this.tileSize, this.tileSize);
                this.draw.image(this.grid[i][j].image,
                    (new geom.Vector(this.tileSize * i, this.tileSize * j)).add(size.mul(1 / 2)), size);
            }
        }

        // People
        for (let i = 0; i < this.entities.length; i++) {
            this.draw.image(this.entities[i].animation.current_state, this.entities[i].body.center, new geom.Vector(1, 1));
        }
    }
}