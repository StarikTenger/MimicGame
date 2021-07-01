define("Geom", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector = exports.eps = void 0;
    exports.eps = 1e-9;
    var Vector = (function () {
        function Vector(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector.prototype.clone = function () {
            return new Vector(this.x, this.y);
        };
        Vector.prototype.add = function (a) {
            return new Vector(this.x + a.x, this.y + a.y);
        };
        Vector.prototype.sub = function (a) {
            return new Vector(this.x - a.x, this.y - a.y);
        };
        Vector.prototype.mul = function (a) {
            return new Vector(this.x * a, this.y * a);
        };
        Vector.prototype.abs = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Vector.prototype.norm = function () {
            if (this.abs() < exports.eps) {
                return new Vector(0, 0);
            }
            return this.mul(1 / this.abs());
        };
        Vector.prototype.rotate = function (angle) {
            return new Vector(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle));
        };
        Vector.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        return Vector;
    }());
    exports.Vector = Vector;
});
define("Control", ["require", "exports", "Geom"], function (require, exports, geom) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Control = exports.Keys = void 0;
    var Keys;
    (function (Keys) {
        Keys[Keys["LeftArrow"] = 37] = "LeftArrow";
        Keys[Keys["UpArrow"] = 38] = "UpArrow";
        Keys[Keys["RightArrow"] = 39] = "RightArrow";
        Keys[Keys["DownArrow"] = 40] = "DownArrow";
    })(Keys = exports.Keys || (exports.Keys = {}));
    var Control = (function () {
        function Control() {
        }
        Control.init = function () {
            for (var i = 0; i < 256; i++) {
                Control._keys[i] = false;
            }
            window.addEventListener("keydown", Control.onKeyDown);
            window.addEventListener("keyup", Control.onKeyUp);
            window.addEventListener("click", Control.onClick);
        };
        Control.isKeyDown = function (key) {
            return Control._keys[key];
        };
        Control.isMouseClicked = function () {
            return this.clicked;
        };
        Control.lastMouseCoordinates = function () {
            this.clicked = false;
            return this.mouseCoordinates;
        };
        Control.onKeyDown = function (event) {
            Control._keys[event.keyCode] = true;
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        Control.onKeyUp = function (event) {
            Control._keys[event.keyCode] = false;
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        Control.onClick = function (event) {
            Control.clicked = true;
            Control.mouseCoordinates = new geom.Vector(event.x, event.y);
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        Control._keys = [];
        Control.clicked = false;
        Control.mouseCoordinates = new geom.Vector(0, 0);
        return Control;
    }());
    exports.Control = Control;
});
define("Draw", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Draw = exports.Color = exports.Camera = void 0;
    var Camera = (function () {
        function Camera() {
        }
        return Camera;
    }());
    exports.Camera = Camera;
    var Color = (function () {
        function Color(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        return Color;
    }());
    exports.Color = Color;
    var Draw = (function () {
        function Draw(canvas, size) {
            this.cam = new Camera();
            this.canvas = canvas;
            canvas.width = size.x;
            canvas.height = size.y;
            this.ctx = canvas.getContext("2d");
            this.cam.scale = 1;
            this.cam.pos = size.mul(1 / 2);
            this.cam.center = size.mul(1 / 2);
        }
        Draw.loadImage = function (src) {
            var image = new Image();
            image.src = src;
            return image;
        };
        Draw.prototype.transform = function (pos) {
            var posNew = pos.clone();
            posNew = posNew.sub(this.cam.pos);
            posNew = posNew.mul(this.cam.scale);
            posNew = posNew.add(this.cam.center);
            return posNew;
        };
        Draw.prototype.image = function (image, pos, box, angle) {
            if (angle === void 0) { angle = 0; }
            var posNew = this.transform(pos);
            var boxNew = box.mul(this.cam.scale);
            posNew = posNew.sub(boxNew.mul(1 / 2));
            this.ctx.drawImage(image, posNew.x, posNew.y, boxNew.x, boxNew.y);
        };
        Draw.prototype.fillRect = function (pos, box, color) {
            var posNew = this.transform(pos);
            var boxNew = box.mul(this.cam.scale);
            posNew = posNew.sub(boxNew.mul(1 / 2));
            this.ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
            this.ctx.fillRect(posNew.x, posNew.y, boxNew.x, boxNew.y);
        };
        Draw.prototype.clear = function () {
            this.ctx.clearRect(-1000, -1000, 10000, 10000);
        };
        return Draw;
    }());
    exports.Draw = Draw;
});
define("Tile", ["require", "exports", "Draw"], function (require, exports, Draw_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tile = exports.CollisionType = void 0;
    var CollisionType;
    (function (CollisionType) {
        CollisionType[CollisionType["Empty"] = 0] = "Empty";
        CollisionType[CollisionType["CornerUL"] = 1] = "CornerUL";
        CollisionType[CollisionType["CornerUR"] = 2] = "CornerUR";
        CollisionType[CollisionType["CornerDL"] = 3] = "CornerDL";
        CollisionType[CollisionType["CornerDR"] = 4] = "CornerDR";
        CollisionType[CollisionType["Full"] = 5] = "Full";
    })(CollisionType = exports.CollisionType || (exports.CollisionType = {}));
    var Tile = (function () {
        function Tile(colision) {
            if (colision === void 0) { colision = 0; }
            this.colision = CollisionType.Empty;
            this.colision = colision;
            if (colision == 0) {
                this.image = Draw_1.Draw.loadImage("textures/Empty.png");
            }
            if (colision == 1) {
                this.image = Draw_1.Draw.loadImage("textures/CornerUL.png");
            }
            if (colision == 2) {
                this.image = Draw_1.Draw.loadImage("textures/CornerUR.png");
            }
            if (colision == 3) {
                this.image = Draw_1.Draw.loadImage("textures/CornerDL.png");
            }
            if (colision == 4) {
                this.image = Draw_1.Draw.loadImage("textures/CornerDR.png");
            }
            if (colision == 5) {
                this.image = Draw_1.Draw.loadImage("textures/Full.png");
            }
        }
        Tile.prototype.setColision = function (colision) {
            this.colision = colision;
        };
        Tile.prototype.setImage = function (image) {
            this.image = image;
        };
        return Tile;
    }());
    exports.Tile = Tile;
});
define("Entities/EntityAttributes/Body", ["require", "exports", "Geom", "Tile"], function (require, exports, geom, Tile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Body = void 0;
    var Body = (function () {
        function Body(center, radius) {
            this.center = center;
            this.radius = radius;
        }
        Body.prototype.move = function (delta) {
            var collision = this.game.check_wall(this.center.add(delta));
            if (collision == Tile_1.CollisionType.Full)
                delta = new geom.Vector();
            else if (collision != Tile_1.CollisionType.Empty) {
                var norm = void 0;
                if (collision == Tile_1.CollisionType.CornerDL)
                    norm = new geom.Vector(1, -1);
                if (collision == Tile_1.CollisionType.CornerDR)
                    norm = new geom.Vector(-1, -1);
                if (collision == Tile_1.CollisionType.CornerUL)
                    norm = new geom.Vector(1, 1);
                if (collision == Tile_1.CollisionType.CornerUR)
                    norm = new geom.Vector(-1, 1);
                delta = delta.sub(norm.mul(delta.dot(norm) / norm.dot(norm))).add(norm.mul(1 / 10000));
            }
            var posNew = this.center.add(delta);
            this.center = posNew;
        };
        return Body;
    }());
    exports.Body = Body;
});
define("Entities/EntityAttributes/Brain", ["require", "exports", "Control", "Geom"], function (require, exports, Control_1, geom) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Brain = void 0;
    var Brain = (function () {
        function Brain(game, personID) {
            this.takeControl = false;
            this.game = game;
            this.personID = personID;
        }
        Brain.prototype.bodyControl = function () {
            if (this.personID == this.game.playerID) {
                var vel = 0.01;
                if (Control_1.Control.isKeyDown(Control_1.Keys.UpArrow)) {
                    this.game.entities[this.personID].body.move(new geom.Vector(0, -vel));
                }
                if (Control_1.Control.isKeyDown(Control_1.Keys.DownArrow)) {
                    this.game.entities[this.personID].body.move(new geom.Vector(0, vel));
                }
                if (Control_1.Control.isKeyDown(Control_1.Keys.RightArrow)) {
                    this.game.entities[this.personID].body.move(new geom.Vector(vel, 0));
                }
                if (Control_1.Control.isKeyDown(Control_1.Keys.LeftArrow)) {
                    this.game.entities[this.personID].body.move(new geom.Vector(-vel, 0));
                }
                if (Control_1.Control.isMouseClicked()) {
                    var coords = new geom.Vector(Control_1.Control.lastMouseCoordinates().x / this.game.draw.cam.scale, Control_1.Control.lastMouseCoordinates().y / this.game.draw.cam.scale);
                    coords = coords.sub(this.game.draw.cam.center.mul(1.0 / this.game.draw.cam.scale));
                    var infectionRadius = 100;
                    for (var i = 0; i < this.game.entities.length; i++) {
                        var centerDistance = this.game.entities[this.personID].body.center.sub(this.game.entities[i].body.center).abs();
                        var isMouseOn = this.game.entities[i].body.center.sub(coords).abs();
                        if ((centerDistance < infectionRadius) && (isMouseOn < this.game.entities[i].body.radius) && (i != this.personID)) {
                            this.game.playerID = i;
                            break;
                        }
                    }
                }
            }
            else {
            }
        };
        return Brain;
    }());
    exports.Brain = Brain;
});
define("Entities/EntityAttributes/Animation", ["require", "exports", "Draw"], function (require, exports, Draw_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Animation = void 0;
    var Animation = (function () {
        function Animation() {
            this.stateMachine = [];
            this.current_state = Draw_2.Draw.loadImage("textures/img.png");
        }
        return Animation;
    }());
    exports.Animation = Animation;
});
define("Entities/Entity", ["require", "exports", "Entities/EntityAttributes/Animation"], function (require, exports, Animation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Entity = void 0;
    var Entity = (function () {
        function Entity(body, brain) {
            this.brain = brain;
            this.body = body;
            this.animation = new Animation_1.Animation();
        }
        return Entity;
    }());
    exports.Entity = Entity;
});
define("Game", ["require", "exports", "Geom", "Entities/EntityAttributes/Body", "Entities/Entity", "Control", "Tile", "Entities/EntityAttributes/Brain"], function (require, exports, geom, Body_1, Entity_1, Control_2, Tile_2, Brain_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Game = void 0;
    var Game = (function () {
        function Game(draw) {
            this.tileSize = 1;
            this.bodies = [];
            this.brains = [];
            this.entities = [];
            this.grid = [];
            this.playerID = 0;
            Control_2.Control.init();
            this.draw = draw;
            var sizeX = 10;
            var sizeY = 10;
            for (var x = 0; x < sizeX; x++) {
                this.grid[x] = [];
                for (var y = 0; y < sizeY; y++) {
                    this.grid[x][y] = new Tile_2.Tile();
                }
            }
            this.grid[0][0] = new Tile_2.Tile(Tile_2.CollisionType.CornerDR);
            this.grid[1][1] = new Tile_2.Tile(Tile_2.CollisionType.CornerUL);
            this.grid[0][1] = new Tile_2.Tile(Tile_2.CollisionType.CornerUR);
            this.grid[1][0] = new Tile_2.Tile(Tile_2.CollisionType.CornerDL);
        }
        Game.prototype.make_body = function (coordinates, radius) {
            var body = new Body_1.Body(coordinates, radius);
            body.game = this;
            return this.bodies[this.bodies.length] = body;
        };
        Game.prototype.make_brain = function () {
            var brain = new Brain_1.Brain(this, this.brains.length);
            return this.brains[this.brains.length] = brain;
        };
        Game.prototype.make_person = function (body, brain) {
            return this.entities[this.entities.length] = new Entity_1.Entity(body, brain);
        };
        Game.prototype.step = function () {
            for (var i = 0; i < this.entities.length; i++) {
                this.entities[i].brain.bodyControl();
            }
        };
        Game.prototype.check_wall = function (pos) {
            var posRound = new geom.Vector(Math.floor(pos.x / this.tileSize), Math.floor(pos.y / this.tileSize));
            if (posRound.x < 0 || posRound.y < 0 ||
                posRound.x >= this.grid.length ||
                posRound.y >= this.grid[0].length)
                return 0;
            var collisionType = this.grid[posRound.x][posRound.y].colision;
            var posIn = pos.sub(posRound.mul(this.tileSize)).mul(1 / this.tileSize);
            if (collisionType == Tile_2.CollisionType.Full ||
                collisionType == Tile_2.CollisionType.CornerUR && posIn.y < posIn.x ||
                collisionType == Tile_2.CollisionType.CornerDL && posIn.y > posIn.x ||
                collisionType == Tile_2.CollisionType.CornerDR && posIn.y > 1 - posIn.x ||
                collisionType == Tile_2.CollisionType.CornerUL && posIn.y < 1 - posIn.x)
                return collisionType;
            return Tile_2.CollisionType.Empty;
        };
        Game.prototype.display = function () {
            this.draw.cam.pos = new geom.Vector(0, 0);
            this.draw.cam.scale = 100;
            for (var i = 0; i < this.grid.length; i++) {
                for (var j = 0; j < this.grid[i].length; j++) {
                    var size = new geom.Vector(this.tileSize, this.tileSize);
                    this.draw.image(this.grid[i][j].image, (new geom.Vector(this.tileSize * i, this.tileSize * j)).add(size.mul(1 / 2)), size);
                }
            }
            for (var i = 0; i < this.entities.length; i++) {
                this.draw.image(this.entities[i].animation.current_state, this.entities[i].body.center, new geom.Vector(1, 1));
            }
        };
        return Game;
    }());
    exports.Game = Game;
});
define("Main", ["require", "exports", "Geom", "Draw", "Game"], function (require, exports, geom, Draw_3, Game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var canvas = document.getElementById('gameCanvas');
    var draw = new Draw_3.Draw(canvas, new geom.Vector(640, 640));
    var game = new Game_1.Game(draw);
    game.make_person(game.make_body(new geom.Vector(0, 0), 1), game.make_brain());
    game.make_person(game.make_body(new geom.Vector(0, 0), 1), game.make_brain());
    function t() {
        draw.clear();
        game.step();
        game.display();
    }
    setInterval(t, 5);
});
//# sourceMappingURL=build.js.map