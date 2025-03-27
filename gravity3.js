//canvas

const c = document.getElementById("gameCanvas");
const ctx = c.getContext("2d");

//general for game

let arrowUp = false;
let arrowLeft = false;
let arrowRight = false;
let space = false;
let throwRock = false;

let maxVelocity = 15;

let G = 15;

let scale = 1;

//keyboard control

document.addEventListener('keydown', function(event) {

    switch (event.key) {
        case 'ArrowUp':
            arrowUp = true;
            break;

        case 'ArrowLeft':
            arrowLeft = true;
            break;

        case 'ArrowRight':
            arrowRight = true;
            break;

        case ' ':
            space = true;
            break;

        case 'a':
            arrowLeft = true;
            break;

        case 'd':
            arrowRight = true;
            break;

        case 'z': 
            throwRock = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
        case 'ArrowUp':
            arrowUp = false;
            break;
        case ' ':
            space = false;
            break;
        case 'ArrowLeft':
        case 'a':
            arrowLeft = false;
            break;
        case 'ArrowRight':
        case 'd':
            arrowRight = false;
            break;

        case 'z': 
        throwRock = false;
        break;
    }
});

//entity class

class Entity {

    right = 1;
    x = 700;
    y = -500;
    width = 20;    
    height = 40;
    vx = 0;
    vy = 0;
    ax = 0;
    ay = 0;
    onGround = false;
    angle = 0;
    groundPlanet = -1;
    speed = 1;
    jumpC = 6;
    traveling = 20;
    jumping = 10;
    hitboxR = 20;
    hitboxX = 200;
    hitboxY = 200;
    throwing = 10;
    lifePoints = 10;
            
    constructor(){
        this.traveling = 20;
    }

    //entity updates

    //update hitbox
    hitboxUpdate(){
        this.hitboxX = this.x + (Math.cos(this.angle) * 15) * this.right + Math.sin(this.angle) * 5;
        this.hitboxY = this.y + (Math.sin(this.angle) * 15) * this.right - Math.cos(this.angle) * 5;
    }

    gravityUpdate(currentGalaxy){
        
        //restart stats
        this.ax = 0;
        this.ay = 0;
        this.groundPlanet = -1;
        this.onGround = false;
        for(let i=0; i < currentGalaxy.numPlanets; i++){
            let xDistance = currentGalaxy.planets[i].x - this.x;
            let yDistance = currentGalaxy.planets[i].y - this.y;
            let distSquared = xDistance * xDistance + yDistance * yDistance;
            let dist = Math.sqrt(distSquared);

            //verify if entity is on planet i
            if(dist < currentGalaxy.planets[i].r + 5){
                this.groundPlanet = i;
                this.onGround = true;
                break;
            }

            //update g
            else{
                let g = (G * currentGalaxy.planets[i].mass) / distSquared; 
                this.ax += g * (xDistance / dist); 
                this.ay += g * (yDistance / dist);
            }
        }
    }

    motionUpdate(currentGalaxy){

        //verify if entity is in space
        if(this.groundPlanet == -1){ 
            this.vx += this.ax;
            this.vy += this.ay;
            this.angle = Math.atan2(this.ay, this.ax) - Math.PI / 2 ;

        }

        //if entity is on planet
        else{
            let planet = currentGalaxy.planets[this.groundPlanet];
            let xDistance = planet.x - this.x;
            let yDistance = planet.y - this.y;
            let dist = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

            let relVx = this.vx - planet.vx;
            let relVy = this.vy - planet.vy;

            relVx *= planet.friction;
            relVy *= planet.friction;

            this.vx = relVx + planet.vx;
            this.vy = relVy + planet.vy;

            this.angle = (Math.atan2(yDistance, xDistance) - Math.PI / 2);

            //overlap correction

            if (dist != planet.r) {
                this.x = planet.x - Math.cos(this.angle + Math.PI / 2) * planet.r;
                this.y = planet.y - Math.sin(this.angle + Math.PI / 2) * planet.r;
            }
        }

        //generals

         //velocity correction

         if(this.vx > maxVelocity){
            this.vx = maxVelocity;
        }

        if(this.vy > maxVelocity){
            this.vy = maxVelocity;
        }

        if(this.vx < -maxVelocity){
            this.vx = -maxVelocity;
        }

        if(this.vy < -maxVelocity){
            this.vy = -maxVelocity;
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    //check portal collision

    checkRockCollision(){
        if(this.hit >= 20){
            for(let i=0; i < currentGalaxy.numRocks; i++){
                let dx = currentGalaxy.rocks[i].x - this.x;
                let dy = currentGalaxy.rocks[i].y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if(dist <= currentGalaxy.rocks[i].r + player.width){
                    this.lifePoints --;
                    this.hit = 0;
                }
            }
        }
        else{
            this.hit ++;
        }
    }

    // controls

    moveLeft() {
        this.vx -= Math.cos(this.angle) * this.speed;
        this.vy -= Math.sin(this.angle) * this.speed;
    }
    
    moveRight() {
        this.vx += Math.cos(this.angle) * this.speed;
        this.vy += Math.sin(this.angle) * this.speed;
    }
    
    jump() {
        if(this.jumping == 30){
            this.vx += Math.cos(this.angle - Math.PI / 2) * this.jumpC;
            this.vy += Math.sin(this.angle - Math.PI / 2) * this.jumpC;
            this.jumping = 0;
        }
    }

    mine(){
        for(let i = currentGalaxy.numRocks - 1; i >= 0; i--){
            let rock = currentGalaxy.rocks[i];
            let Xdist = this.hitboxX - rock.x;
            let Ydist = this.hitboxY - rock.y;

            let dist = Math.sqrt((Xdist * Xdist) + (Ydist * Ydist));

            if(dist <= rock.r + this.hitboxR){

                switch(rock.material){
                    
                    case "rock": this.rocksCount++;
                    break;

                    case "metal": this.metalCount++;
                    break;

                    case "gravitanium": this.gravitaniumCount++;
                    break;
                }

                if(this.rocksCount < 10 && this.metalCount < 10 && this.gravitaniumCount < 10){
                    currentGalaxy.rocks.splice(i, 1);
                    currentGalaxy.numRocks --;
                }
                else{
                    switch(rock.material){
                    
                        case "rock": this.rocksCount--;
                        break;
    
                        case "metal": this.metalCount--;
                        break;
    
                        case "gravitanium": this.gravitaniumCount--;
                        break;
                    }
                }
            }
        }
    }

    throw(){
        if(this.throwing == 100){
            if (this.metalCount > 0){
                this.metalCount --;
                let rock = { x: this.x + Math.sin(this.angle) * 50, y: this.y - Math.cos(this.angle) * 50, r: 10, vx: Math.cos(this.angle) * 10 * this.right + this.vx, vy: Math.sin(this.angle) * 10 * this.right + this.vy, ax: 0, ay: 0, groundPlanet: -1, material: "metal" };
                currentGalaxy.rocks.push(rock);
                currentGalaxy.numRocks++;
                this.throwing = 0;
            }
        }
    }

    //draw entity

    draw(){
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.save();
        ctx.translate(this.x - player.x + 700, this.y - player.y + 400);
        ctx.rotate(this.angle);
        ctx.fillRect(-this.width, -this.height, this.width * scale, this.height * scale);
        ctx.restore();
        ctx.closePath();

    }
}

class Player extends Entity {

    checkPortalCollision() {

        if(this.traveling >= 20){
            for(let i=0; i < currentGalaxy.numPortals; i++){
                let dx = currentGalaxy.portals[i].x - this.x;
                let dy = currentGalaxy.portals[i].y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if(dist <= currentGalaxy.portals[i].r + player.width){
                    this.x = currentGalaxy.portals[i].xIndex;
                    this.y = currentGalaxy.portals[i].yIndex;
                    currentGalaxy = levels[currentGalaxy.portals[i].index];
                    this.traveling = 0;
                    console.log(currentGalaxy);
                }
            }
        }
        else{
            this.traveling ++;
        }
    }
    
    draw(){
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.save();
        ctx.translate(700, 400);
        ctx.rotate(this.angle);
        ctx.fillRect(-this.width / 2 * scale, -this.height * scale, this.width * scale, this.height * scale);
        ctx.restore();
        ctx.closePath();

        //draw hitbox

        ctx.beginPath();
        ctx.save();

        ctx.arc(700 + (Math.cos(this.angle) * 15) * this.right * scale + Math.sin(this.angle) * 5 * scale, 400 + (Math.sin(this.angle) * 15) * this.right * scale - Math.cos(this.angle) * 5 * scale, this.hitboxR * scale, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.restore();
        ctx.closePath();

    }
}

//galaxy class

class Galaxy {

    rocksCounter = 0;

    constructor(planets, portals, rocks, entities) {
        this.numEntities = entities.length;
        this.numPlanets = planets.length;
        this.numPortals = portals.length;
        this.numRocks = rocks.length;
        this.entities = entities;
        this.planets = planets;
        this.portals = portals;
        this.rocks = rocks;
    }

    //planets updates

    updatePlanetsGravity(planet, i){
        planet.ax = 0;
        planet.ay = 0;
        for(let j=0; j < this.numPlanets; j++){
            if(j != i){
                let xDistance = this.planets[j].x - planet.x;
                let yDistance = this.planets[j].y - planet.y;
                let distSquared = xDistance * xDistance + yDistance * yDistance;
                let dist = Math.sqrt(distSquared);
                if (dist > this.planets[j].r) { 
                    let g = (G * this.planets[j].mass) / distSquared; 
                    planet.ax += g * (xDistance / dist); 
                    planet.ay += g * (yDistance / dist);
                } 
                else {
                //resolve collision
                }
            }
        }
    }

    updatePlanetsMotion(){

        //gravity

        for(let i=0; i < this.numPlanets; i++){
            let planet = this.planets[i];
            if(planet.gravity){
                this.updatePlanetsGravity(planet, i);
            }
            //update stats
            planet.vx += planet.ax;
            planet.vy += planet.ay;

            //velocity correction

            if(planet.vx > maxVelocity){
                planet.vx = maxVelocity;
            }
    
            if(planet.vy > maxVelocity){
                planet.vy = maxVelocity;
            }
    
            if(planet.vx < -maxVelocity){
                planet.vx = -maxVelocity;
            }
    
            if(planet.vy < -maxVelocity){
                planet.vy = -maxVelocity;
            }

            planet.x += planet.vx;
            planet.y += planet.vy;
        }
    }

    //rocks updates

    updateRockGravity(rock, i){
        rock.ax = 0;
        rock.ay = 0;
        rock.groundPlanet = -1;
        for(let j=0; j < this.numPlanets; j++){
            if(j != i){
                let xDistance = this.planets[j].x - rock.x;
                let yDistance = this.planets[j].y - rock.y;
                let distSquared = xDistance * xDistance + yDistance * yDistance;
                let dist = Math.sqrt(distSquared);
                if (dist > this.planets[j].r + 10) { 
                    let g = (G * this.planets[j].mass) / distSquared; 
                    rock.ax += g * (xDistance / dist); 
                    rock.ay += g * (yDistance / dist);
                } 
                else {
                    rock.vx = 0;
                    rock.vy = 0;
                    rock.ax = 0;
                    rock.ay = 0;
                    rock.groundPlanet = j;
                    break;
                }
            }
        }
    }

    updateRocksMotion(){
        for(let i=0; i < this.numRocks; i++){
            let rock = this.rocks[i];
            
            this.updateRockGravity(rock, i);

            //update stats
            rock.vx += rock.ax;
            rock.vy += rock.ay;

            //velocity correction

            if(this.vx > maxVelocity){
                this.vx = maxVelocity;
            }
    
            if(this.vy > maxVelocity){
                this.vy = maxVelocity;
            }
    
            if(this.vx < -maxVelocity){
                this.vx = -maxVelocity;
            }
    
            if(this.vy < -maxVelocity){
                this.vy = -maxVelocity;
            }

            rock.x += rock.vx;
            rock.y += rock.vy;

            if(rock.groundPlanet != -1){
                let Xdist = rock.x - this.planets[rock.groundPlanet].x;
                let Ydist = rock.y - this.planets[rock.groundPlanet].y;
                let dist = Math.sqrt((Xdist * Xdist) + (Ydist * Ydist));

                //overlap 
                if (dist - this.planets[rock.groundPlanet].r < - 5) {

                    let angle = Math.atan2(Ydist, Xdist);
                    rock.x = this.planets[rock.groundPlanet].x + Math.cos(angle) * this.planets[rock.groundPlanet].r;
                    rock.y = this.planets[rock.groundPlanet].y - Math.sin(angle) * this.planets[rock.groundPlanet].r;
                }
            }
        }
    }

    createNewRocks(){
        if(this.rocksCounter % 1000 === 0 && this.rocksCounter !== 0 && this.numRocks < 10){
            let material;
            switch(this.rocksCounter % 7 == 0){
                case false: 
                    material = "metal";
                    break;

                case true:
                    material = "gravitanium";
                    break;
            }
            let rock = { x: -1000 + this.rocksCounter / 10, y: -2000 - this.rocksCounter / 10, r: 10, vx: 0, vy:0, ax: 0, ay: 0, groundPlanet: -1, material: material};
            this.rocks.push(rock);
            this.numRocks ++;
        }
        if(this.rocksCounter == 10000){
            this.rocksCounter = 0;
        }
            this.rocksCounter ++;
    }

    //draw planets

    drawPlanets(player){

        for (let i = 0; i < this.numPlanets; i++) {

            if( (this.planets[i].x - this.planets[i].r < player.x + 700) && (this.planets[i].x + this.planets[i].r > player.x - 700) && (this.planets[i].y - this.planets[i].r < player.y + 400) && (this.planets[i].y + this.planets[i].r > player.y - 400) ) {

                let color;

                switch (this.planets[i].material){

                    case "rock": color = "#654321";
                    break;

                    case "metal": color = "grey";
                    break;

                    case "lava": color = "red";
                    break;

                    case "gravitanium": color = "purple";
                    break;
                }

                ctx.beginPath();
                ctx.arc((this.planets[i].x - player.x) * scale + 700, (this.planets[i].y - player.y) * scale + 400, (this.planets[i].r) * scale, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    //draw rocks

    drawRocks(player){
        for (let i = 0; i < this.numRocks; i++) {
            if( (this.rocks[i].x - this.rocks[i].r < player.x + 700) && (this.rocks[i].x + this.rocks[i].r > player.x - 700) && (this.rocks[i].y - this.rocks[i].r < player.y + 400) && (this.rocks[i].y + this.rocks[i].r > player.y - 400) ){

                let color;

                switch (this.rocks[i].material){

                    case "rock": color = "black";
                    break;
    
                    case "metal": color = "grey";
                    break;
    
                    case "lava": color = "red";
                    break;
    
                    case "gravitanium": color = "purple";
                    break;
                }

                ctx.beginPath();
                ctx.arc((this.rocks[i].x - player.x) * scale + 700, (this.rocks[i].y - player.y) * scale + 400, this.rocks[i].r * scale, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    //draw portals

    drawPortals(player){
        for (let i = 0; i < this.numPortals; i++) {
            if( (this.portals[i].x - this.portals[i].r < player.x + 700) && (this.portals[i].x + this.portals[i].r > player.x - 700) && (this.portals[i].y - this.portals[i].r < player.y + 400) && (this.portals[i].y + this.portals[i].r > player.y - 400) ){
            ctx.beginPath();
            ctx.arc((this.portals[i].x - player.x) * scale + 700, (this.portals[i].y - player.y) * scale + 400, this.portals[i].r * scale, 0, Math.PI * 2);
            ctx.fillStyle = "yellow";
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

//predef levels

const levels = [

    //home 0
    new Galaxy(

        //planets
        [
            //home planet
            { x: 720, y: 1700, r: 1000, mass: 10000, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock" },

            //smaller planets
            { x: 250, y: 400, r: 100, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.80, deadly: false, material: "rock" },
            { x: 720, y: 250, r: 100, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.80, deadly: false, material: "rock"},
            { x: 1200, y: 400, r: 100, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.80, deadly: false, material: "rock" },
            { x: 250, y: -200, r: 100, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.80, deadly: false, material: "rock" },
            { x: 900, y: -300, r: 100, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.80, deadly: false, material: "rock" },
            { x: 1400, y: 0, r: 100, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.80, deadly: false, material: "rock" },
            { x: -100, y: 150, r: 100, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.80, deadly: false, material: "rock" },
            { x: -200, y: -500, r: 100, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.80, deadly: false, material: "rock" },
            { x: 1400, y: 0, r: 100, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.80, deadly: false, material: "rock" },
        ],

        //portals
        [
            { x: 100, y: 270, r: 20, index: 1, xIndex: 700, yIndex: 400 },
            { x: 750, y: 100, r: 20, index: 2, xIndex: 500, yIndex: 500 },
            { x: 1200, y: 200, r: 20, index: 3, xIndex: 650, yIndex: 480 },
        ],

        //rocks
        [
            { x: 1000, y:0, r: 10, vx: 0, vy:0, ax: 0, ay: 0, groundPlanet: -1, material: "metal" },
            { x: 100, y:10, r: 10, vx: 0, vy:0, ax: 0, ay: 0, groundPlanet: -1, material: "gravitanium" }
        ],

        //entities

        [
            new Entity()
        ]
    ),

    // 1

    new Galaxy(

        //planets
        [
            { x: 200, y: 1000, r: 100, mass: 250, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.95, deadly: false, material: "rock" },
            { x: 500, y: 700, r: 100, mass: 250, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.95, deadly: false, material: "rock" },
            { x: 800, y: 400, r: 100, mass: 250, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.95, deadly: false, material: "rock" }
        ],
        //portals
        [],

        //rocks
        [],

        //entities
        
        []
    ),

    // 2

    new Galaxy(
        [
            // Bigger planets
            { x: 1000, y: 1200, r: 600, mass: 8000, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.93, deadly: false, material: "rock" },
            { x: -2500, y: -500, r: 600, mass: 8000, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.95, deadly: false, material: "rock" },

            // Medium size planets
            { x: -2000, y: 1000, r: 200, mass: 700, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.95, deadly: true, material: "lava" },
            { x: -1000, y: 700, r: 170, mass: 500, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.95, deadly: false, material: "rock" },
            { x: -350, y: 1200, r: 130, mass: 300, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.95, deadly: false, material: "rock" },
            { x: 100, y: 1800, r: 200, mass: 700, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.95, deadly: true, material: "lava" },
            { x: -1500, y: 0, r: 170, mass: 500, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.95, deadly: false, material: "rock"},
            { x: 200, y: 0, r: 130, mass: 300, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.95, deadly: false, material: "rock" },
            { x: -900, y: 1800, r: 110, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock" },
            { x: -1500, y: 2200, r: 100, mass: 500, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock" },
            { x: 1000, y: -300, r: 130, mass: 300, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: true, material: "lava" },
            { x: 2000, y: 100, r: 130, mass: 300, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock" },
            { x: 3000, y: 2000, r: 130, mass: 300, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock" },
            { x: 1700, y: 2800, r: 130, mass: 300, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock" }
        ],
        //portals
        [
            { x: 500, y: 500, r: 20, index: 0, xIndex: 800, yIndex: 100 }
        ],

        //rocks
        [],

        //entities
        
        []
    ),

    // 3

    new Galaxy(
        [
            { x: 650, y: 400, r: 50, mass: 20, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock"},
            { x: 250, y: 250, r: 100, mass: 600, vx: 0, vy: 0, ax:0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock"},
            { x: 1000, y: 250, r: 100, mass: 600, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock"},
            { x: 250, y: 600, r: 100, mass: 600, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock"},
            { x: 1000, y: 600, r: 100, mass: 600, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false, friction: 0.90, deadly: false, material: "rock"},
            { x: 100, y: 100, r: 30, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: true, friction: 0.80, deadly: false, material: "metal"},
        ],
        //portals
        [
            { x: 650, y: 480, r: 20, index: 0, xIndex: 1300, yIndex: 200 }
        ],

        //rocks
        [],

        //entities
        
        []
    )
];


//player generate 
let player = new Player;

//current level
let currentGalaxy = levels[0];

//draw
function draw(){

    ctx.clearRect(0, 0, c.width, c.height);
    player.draw();

    for(let i = 0; i < currentGalaxy.numEntities; i++){
        currentGalaxy.entities[i].draw();
    }

    currentGalaxy.drawPlanets(player);
    currentGalaxy.drawPortals(player);
    currentGalaxy.drawRocks(player);
}

//keyBoard
function Keyboard(){
    if(player.jumping != 30){
        player.jumping ++;
    }

    if(player.throwing != 100){
        player.throwing ++;
    }

    if(arrowLeft){
        player.right = -1;
        if(player.onGround){
        player.moveLeft();
        }
    }
    if(arrowRight){
        player.right = 1;
        if(player.onGround){
        player.moveRight();
        }
    }
    if(arrowUp && player.onGround){
        player.jump();
    }
    if(space){
        player.mine();
    }
    if(throwRock){
        player.throw();
    }
}

//fps count

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function fpsCount(){
    let now = performance.now();
    frameCount++;

    if (now - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = now;
        console.log("FPS:", fps); 
    }

}

//phisics

function phisics(){
    player.gravityUpdate(currentGalaxy);

    for(let i = 0; i < currentGalaxy.numEntities; i++){
        currentGalaxy.entities[i].gravityUpdate(currentGalaxy);
    }

    currentGalaxy.updatePlanetsMotion();
    player.motionUpdate(currentGalaxy);

    for(let i = 0; i < currentGalaxy.numEntities; i++){
        currentGalaxy.entities[i].motionUpdate(currentGalaxy);
    }

    player.hitboxUpdate();
    player.checkPortalCollision();
    player.checkRockCollision();
    currentGalaxy.updateRocksMotion();

    currentGalaxy.createNewRocks();
}



//game loop

let frameC = 0;

function gameLoop(){

    phisics();

    Keyboard();

    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
