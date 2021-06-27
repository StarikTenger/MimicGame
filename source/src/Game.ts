import * as geom from "./Geom";
import {Body} from "./Body";
import {Person} from "./Person";
import {Control, Keys} from "./Control";
import {Draw} from "./Draw";
import { Tile, ColisionType } from "./Tile";

export class Game {
    private tile_size = 1
    private draw : Draw;
    private bodies : Body [] = [];
    private people : Person [] = [];
    public grid : Tile [][] = [];

    constructor(draw : Draw) {
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

        this.grid[0][0] = new Tile(ColisionType.Full);
        this.grid[1][1] = new Tile(ColisionType.CornerUL);
        this.grid[0][1] = new Tile(ColisionType.Full);
        this.grid[1][0] = new Tile(ColisionType.Full);
    }

    public make_body(coordinates : geom.Vector, radius : number) : Body {
        let body = new Body(coordinates, radius);
        body.game = this;
        return this.bodies[this.bodies.length] = body;
    }

    public make_person(body : Body) {
        return this.people[this.people.length] = new Person(body);
    }

    public step() {
        if (this.people.length != 0) {
            let vel = 0.01;
            if(Control.isKeyDown(Keys.UpArrow)) {
                this.people[0].body.move(new geom.Vector(0, -vel));
            }
            if(Control.isKeyDown(Keys.DownArrow)) {
                this.people[0].body.move(new geom.Vector(0, vel));
            }
            if(Control.isKeyDown(Keys.RightArrow)) {
                this.people[0].body.move(new geom.Vector(vel, 0));
            }
            if(Control.isKeyDown(Keys.LeftArrow)) {
                this.people[0].body.move(new geom.Vector(-vel, 0));
            }
        }
    }

    public display() {
        this.draw.cam.pos = new geom.Vector(0, 0);
        this.draw.cam.scale = 100;
        // Tiles
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                let size = new geom.Vector(this.tile_size, this.tile_size);
                this.draw.image(this.grid[i][j].image,
                    (new geom.Vector(this.tile_size * i, this.tile_size * j)).add(size.mul(1 / 2)), size);
            }
        }

        // People
        for (let i = 0; i < this.people.length; i++) {
            this.draw.image(this.people[i].animation.current_state, this.people[i].body.center, new geom.Vector(1, 1));
        }
    }
}