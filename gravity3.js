
let idCounter = 0;
let maxVelocity = 15;
scale = 0.5;
G = 15;
let isEditing = true;

const c = document.getElementById("gameCanvas");
const ctx = c.getContext("2d");

//event listener
class EventListener {

    constructor(){
        this.arrowUp = false;
        this.arrowLeft = false;
        this.arrowRight = false;
        this.space = false;
        this.z = false;
        this.k = false;
        this.q = false;

        this.keyDown();
        this.keyUp();

        this.rightClick = false;
        this.leftClick = false;

        this.mouseX = 0;
        this.mouseY = 0;

        this.mouseDown();
        this.mouseUp();
        this.mouseMove();
    }

    keyDown(){
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.arrowUp = true;
                    break;
                case 'ArrowLeft':
                    this.arrowLeft = true;
                    break;
                case 'ArrowRight':
                    this.arrowRight = true;
                    break;
                case ' ':
                    this.space = true;
                    break;
                case 'z': 
                    this.z = true;
                    break;
                case 'k': 
                    this.k = true;
                    break;
                case 'q':
                    this.q = true;
                    break;
            }
        });
    }

    keyUp(){
        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.arrowUp = false;
                    break;
                case 'ArrowLeft':
                    this.arrowLeft = false;
                    break;
                case 'ArrowRight':
                    this.arrowRight = false;
                    break;
                case ' ':
                    this.space = false;
                    break;
                case 'z': 
                    this.z = false;
                    break;
                case 'k': 
                    this.k = false;
                    break;
                case 'q':
                    this.q = false;
                    break;
            }
        });
    }

    keyBoard(player){
        if(this.arrowUp){
            player.action("jump");
        }
        if(this.arrowLeft){
            player.action("moveLeft");
        }
        if(this.arrowRight){
            player.action("moveRight");
        }
        if(this.space){
            player.action("mine");
        }
        if(this.q){
            player.toggleTool();
        }
        if(this.k){
            player.useTool();
        }
        if(this.z){
            player.action("throw");
        }
    }

    mouseDown() {
        document.addEventListener('mousedown', (event) => {
            switch (event.button) {
                case 0:
                    this.mouseLeft = true;
                    edit.takeObject(this);
                    break;
                case 1:
                    this.mouseMiddle = true;
                    break;
                case 2:
                    this.mouseRight = true;
                    break;
            }
        }); 
    }

    mouseUp() {
        document.addEventListener('mouseup', (event) => {
            switch (event.button) {
                case 0:
                    this.mouseLeft = false;
                    edit.leaveObject();
                    break;
                case 1:
                    this.mouseMiddle = false;
                    break;
                case 2:
                    this.mouseRight = false;
                    break;
            }
        }); 
    }

    mouseMove() {
        c.addEventListener("mousemove", (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });
    }

    mouse(){
        if(this.mouseLeft){

        }
        if(this.mouseRight){

        }
        if(this.mouseMiddle){

        }
    }
}

//object
class Object{
    
    constructor(x, y, vx, vy, gravity, mass, galaxy){

        //id
        idCounter++;
        this.id = idCounter;
        identificator.createId(this);

        //generals
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.gravity = gravity;
        this.mass = mass;
        this.galaxy = galaxy;

        this.ax = 0;
        this.ay = 0;
        this.angle = 0;
        this.groundPlanet = -1;
        this.right = 1;

        this.edited = false;
    }

    //collision
    handleCollision(){

    }

    //overlap
    handleOverlap(){

    }

    //gravity
    updateGravity(){ 
        this.ax = 0;
        this.ay = 0;
        this.groundPlanet = -1;

        for(let i = 0; i < levels[this.galaxy].numPlanets; i++){
            let planet = levels[this.galaxy].planets[i];
            let xDistance = planet.x - this.x;
            let yDistance = planet.y - this.y;
            let distSquared = xDistance * xDistance + yDistance * yDistance;
            let dist = Math.sqrt(distSquared);

            //verify if entity is on planet
            if(dist < planet.r + 5){
                this.groundPlanet = planet.id;
                this.handleCollision();
                break;
            }

            //update g
            else{
                let g = this.gravity * (G * planet.mass) / distSquared; 
                this.ax += g * (xDistance / dist); 
                this.ay += g * (yDistance / dist);
            }
        }

        //implement for gravitanium surface...
        //
        //
        //
        //
    }

    //motion general
    updateMotion(){

        //gravity
        if(this.gravity != 0){
            this.updateGravity();

            if(this.groundPlanet == -1){
                this.vx += this.ax;
                this.vy += this.ay;
                this.angle = Math.atan2(this.ay, this.ax) - Math.PI / 2;
            }
        }

        if(this.groundPlanet != -1){
            this.handleOverlap();
        }

        //generals 
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

    //draw
    draw(){

    }
}

//sphere
class Sphere extends Object{

    constructor(x, y, vx, vy, gravity, mass, r, material, galaxy){

        super(x, y, vx, vy, gravity, mass, galaxy);
        this.r = r;
        this.material = material;
    }

    draw(player){

        let xAbsPos = Math.abs(this.x - this.r);
        let yAbsPos = Math.abs(this.y - this.r);

        let color;
        switch (this.material){

            case "rock": color = "#654321";
            break;

            case "metal": color = "grey";
            break;

            case "lava": color = "red";
            break;

            case "gravitanium": color = "purple";
            break;

            case "portal": color = "yellow"
            break;
        }
        ctx.beginPath();
        ctx.arc((this.x - player.x) * scale + c.width / 2, (this.y - player.y) * scale + c.height / 2, (this.r) * scale, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}

//planet
class Planet extends Sphere {

    type = "planet";
    
    constructor(x, y, vx, vy, gravity, mass, r, material, galaxy, friction){
        super(x, y, vx, vy, gravity, mass, r, material, galaxy);

        this.friction = friction;
        this.numBlocks = r * r * Math.PI;
    }
}

//rock
class Rock extends Sphere {

    type = "rock";

    constructor(x, y, vx, vy, gravity, mass, r, material, galaxy, throwBy){

        super(x, y, vx, vy, gravity, mass, r, material, galaxy);
        this.throw = throwBy;
    }

    handleOverlap(){

        let planet = identificator.getObjectFromId(this.groundPlanet);
        let Xdist = planet.x - this.x ;
        let Ydist = planet.y - this.y ;
        let dist = Math.sqrt((Xdist * Xdist) + (Ydist * Ydist)) - planet.r - this.r;

        let relVx = this.vx - planet.vx;
        let relVy = this.vy - planet.vy;
        relVx *= planet.friction;
        relVy *= planet.friction;

        this.vx = relVx + planet.vx;
        this.vy = relVy + planet.vy;

        if(dist <= 0){
            let angle = Math.atan2(Ydist, Xdist);
            this.x = planet.x - Math.cos(angle) * (planet.r);
            this.y = planet.y - Math.sin(angle) * (planet.r);
        }
    }
}

//portal
class Portal extends Sphere{

    type = "portal";
    
    constructor(x, y, vx, vy, gravity, mass, r, material, galaxy, indexG, indexX, indexY){

        super(x, y, vx, vy, gravity, mass, r, material, galaxy);
        this.indexG = indexG;
        this.indexX = indexX;
        this.indexY = indexY;
    }

    checkCollision(){
        for(let i = 0; i < levels[this.galaxy].numEntities; i++){
            let entity = levels[this.galaxy].entities[i];
            let dist = Math.sqrt((this.x - entity.x) * (this.x - entity.x) + (this.y - entity.y) * (this.y - entity.y)) - this.r * 2;

            if(dist <= 0){
                this.teleport(entity.id);
            }
        }
    }

    teleport(id){

        let object = identificator.getObjectFromId(id);
        levels[this.galaxy].removeObject(object);
        object.galaxy = this.indexG;
        object.x = this.indexX;
        object.y = this.indexY;
        levels[this.indexG].addObject(object);
        if(object.type == "player"){
            currentLevel = levels[this.indexG];
        }
        
    }
}

//entity
class Entity extends Object {

    constructor(x, y, vx, vy, gravity, mass, galaxy, height, width, lifePoints, jumpingTiming, jumpC){

        super(x, y, vx, vy, gravity, mass, galaxy);

        this.type = "entity";

        this.height = height;
        this.width = width;
        this.lifePoints = lifePoints;
        this.speed = 1;
        this.jumping = 0;
        this.jumpingTiming = jumpingTiming;
        this.jumpC = jumpC;
        this.toggleTiming = 50;

        this.inventory = new Inventory(50);
        this.hitBox = new Hitbox(50, this.galaxy);
        this.unlockedActions = new Map();
        this.tool = -1;
        this.toggle = 0;
    }

    handleOverlap(){

        let planet = identificator.getObjectFromId(this.groundPlanet);
        let xDistance = planet.x - this.x;
        let yDistance = planet.y - this.y;
        let dist = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));

        let relVx = this.vx - planet.vx;
        let relVy = this.vy - planet.vy;

        relVx *= planet.friction;
            relVy *= planet.friction;

            this.vx = relVx + planet.vx;
            this.vy = relVy + planet.vy;

        this.angle = (Math.atan2(yDistance, xDistance) - Math.PI / 2);

        if (dist != planet.r  && this.jumping > 10) {

            this.x = planet.x - Math.cos(this.angle + Math.PI / 2) * planet.r;
            this.y = planet.y - Math.sin(this.angle + Math.PI / 2) * planet.r;
        }

        if (planet.material == "lava"){
            if(this.damaging == this.damagingTiming){
                this.lifePoints -= 3;
                this.damaging = 0;
            }
        }
    }

    //update stats
    updateStats(){

        this.hitBox.update(this);

        for (let [key, action] of this.unlockedActions) {
            if (action.time < action.timing) {
                action.time++;
            }
        }

        if(this.jumping < this.jumpingTiming){
            this.jumping++;
        }

        if(this.tool != -1){
            identificator.getObjectFromId(this.tool).update();
        }
        if(this.traveling < this.travelingTiming){
            this.traveling++;
        }
        if(this.throwing < this.throwingTiming){
            this.throwing++;
        }
        if(this.damaging < this.damagingTiming){
            this.damaging++;
        }
        if(this.attacking < this.attackingTiming){
            this.attackingTiming++;
        }
        if(this.jetpackAllow < this.jetpackTiming){
            this.jetpackAllow++;
        }
        if(this.toggle < this.toggleTiming){
            this.toggle ++;
        }
    }

    //actions
    unlockAction(name) {
        if(!this.unlockedActions.has(name)){
            this.unlockedActions.set(name, allActions[name]);
        }
    }

    lockAction(name) {
        if(this.unlockedActions.has(name)){
            this.unlockedActions.splice(name);
        }
    }
    
    canPerform(name) {
        return this.unlockedActions.has(name);
    }
    
    action(name) {
        let canPerform = this.canPerform(name);
        if(canPerform){
            this.unlockedActions.get(name).tryExecute(this);
        }
    }

    toggleTool(){
        if(this.toggle == this.toggleTiming){
            if(this.tool == -1){
                for(let i = 0; i < levels[this.galaxy].numTools; i++){
                    if(this.hitBox.onSpot("tool", i)){
                        levels[this.galaxy].tools[i].taken(this);
                        this.tool = levels[this.galaxy].tools[i].id;
                    }
                }
            }
            else{
                let toolObj = identificator.getObjectFromId(this.tool);
                toolObj.left();
                this.tool = -1;
            }
            this.toggle = 0;
        }
    }

    useTool(){
        if(this.tool != -1){
            identificator.getObjectFromId(this.tool).execute();
        }
    }

    draw(){

    }
}

//NPC
class NPC extends Entity {

    draw(player){
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.save();
        ctx.translate(this.x * scale - player.x * scale + c.width / 2, this.y * scale - player.y * scale + c.height / 2);
        ctx.rotate(this.angle);
        ctx.scale(this.right, 1);
        ctx.fillRect(- this.width * scale / 2, -this.height * scale, this.width * scale, this.height * scale);
        ctx.restore();
        ctx.closePath();
    }
}

//player
class Player extends Entity {

    constructor(x, y, vx, vy, gravity, mass, galaxy, height, width, lifePoints, jumpingTiming, jumpC){

        super(x, y, vx, vy, gravity, mass, galaxy, height, width, lifePoints, jumpingTiming, jumpC);
        this.type = "player";
        this.unlockAction("moveLeft");
        this.unlockAction("moveRight");
        this.unlockAction("jump");
        this.unlockAction("mine");
        this.unlockAction("throw");
    }

    draw(){

            ctx.beginPath();
            ctx.fillStyle = "green";
            ctx.save();
            ctx.translate(c.width / 2, c.height / 2);
            ctx.rotate(this.angle);
            ctx.scale(this.right, 1);
            ctx.fillRect(-this.width * scale / 2, -this.height * scale, this.width * scale, this.height * scale);
            ctx.restore();
            ctx.closePath();
    }
}

//property
class Property {

}

//hitbox
class Hitbox extends Property {
    constructor(r, galaxy){
        super();
        this.galaxy = galaxy;
        this.x = 0;
        this.y = 0;
        this.r = r;
    }

    update(entity){
        this.x = entity.x + (Math.cos(entity.angle) * 15) * entity.right + Math.sin(entity.angle) * 5;
        this.y = entity.y + (Math.sin(entity.angle) * 15) * entity.right - Math.cos(entity.angle) * 5;
    }

    onSpot(type, i) {
        let dist;
        switch (type) {
            case "planet": 
                let planet = levels[this.galaxy].planets[i];
                dist = Math.sqrt((this.x - planet.x) ** 2 + (this.y - planet.y) ** 2) - this.r;
                return dist <= 0;
    
            case "rock":
                let rock = levels[this.galaxy].rocks[i];
                dist = Math.sqrt((this.x - rock.x) ** 2 + (this.y - rock.y) ** 2) - this.r;
                return dist <= 0;
    
            case "portal":
                let portal = levels[this.galaxy].portals[i];
                dist = Math.sqrt((this.x - portal.x) ** 2 + (this.y - portal.y) ** 2) - this.r;
                return dist <= 0;

            case "tool":
                let tool = levels[this.galaxy].tools[i];
                
                
                dist = Math.sqrt((this.x - tool.x) ** 2 + (this.y - tool.y) ** 2) - this.r;
                return dist <= 0;
    
            case "entity":
            case "player":
                let entity = levels[this.galaxy].entities[i];
                dist = Math.sqrt((this.x - entity.x) ** 2 + (this.y - entity.y) ** 2) - this.r;
                return dist <= 0;
        }
    }
}

//inventory
class Inventory extends Property{
    constructor(max){
        super();
        this.rocks = [];
        this.total = 0;
        this.max = max;
    }

    allowAdd(){
    }
}

//tool
class Tool extends Object {

    constructor(x, y, vx, vy, gravity, mass, galaxy){
        super(x, y, vx, vy, gravity, mass, galaxy);

        this.type = "tool";

        this.entity = null;
    }

    update(){

    }

    taken(entity){
        this.entity = entity;
        this.gravity = false;
    }

    left(){  
        this.entity = null;
        this.gravity = true;
    }

    execute(){
        ///
    }

    updateMotion(){
        if(this.entity == null){
            super.updateMotion();
        }
    }

    handleOverlap(){

        let planet = identificator.getObjectFromId(this.groundPlanet);
        let xDistance = planet.x - this.x;
        let yDistance = planet.y - this.y;
        let dist = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));

        let relVx = this.vx - planet.vx;
        let relVy = this.vy - planet.vy;

        relVx *= planet.friction;
        relVy *= planet.friction;

        this.vx = relVx + planet.vx;
        this.vy = relVy + planet.vy;

        this.angle = (Math.atan2(yDistance, xDistance) - Math.PI / 2);

        if (dist != planet.r) {

            this.x = planet.x - Math.cos(this.angle + Math.PI / 2) * planet.r;
            this.y = planet.y - Math.sin(this.angle + Math.PI / 2) * planet.r;
        }
    }
}

class Jetpack extends Tool {

    constructor(x, y, vx, vy, gravity, mass, galaxy, tankMax, jetPackTiming){
        super(x, y, vx, vy, gravity, mass, galaxy);
        this.tankMax = tankMax;
        this.tank = 0;
        this.jetPackTiming = jetPackTiming;
        this.jetpackAllow = 0;
    }

    update(){
        if(this.jetpackAllow < this.jetPackTiming){
            this.jetpackAllow++;
        }
        if(this.entity != null){
            this.x = this.entity.x - Math.cos(this.entity.angle) * 10 * this.entity.right + Math.sin(this.entity.angle) * 5;
            this.y = this.entity.y - Math.sin(this.entity.angle) * 10 * this.entity.right - Math.cos(this.entity.angle) * 5;
            this.angle = this.entity.angle;
        }
    }

    charge(){
        let totalMass = 0;
        if (this.entity.inventory.rocks.length > 0){
            for(let i = 0; i < this.entity.inventory.rocks.length; i++){
                totalMass += this.entity.inventory.rocks[i].mass;
                this.entity.inventory.rocks.splice(i, 1);
                if(this.tank + totalMass >= this.tankMax){
                    break;
                }
            }

            this.tank += totalMass;
        }
    }

    execute(){
        if(this.tank == 0){
            this.charge();
        }
        else{
            if(this.jetpackAllow == this.jetPackTiming){
                let tvx = - Math.sin(this.angle) * 10;
                let tvy = Math.cos(this.angle) * 10;
                let rock = new Rock(this.x - tvy * this.entity.right, this.y + tvx, tvx + this.entity.vx, tvy + this.entity.vy, true, 1, 5, "rock", this.galaxy, this.entity.id);
                levels[this.galaxy].addObject(rock);
                this.entity.jumping = 0;
                this.entity.vx -= tvx * 0.2;
                this.entity.vy -= tvy * 0.2;
                this.jetpackAllow = 0;
                this.tank --;
            }
        }
    }

    draw(player){
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.save();
        ctx.translate(this.x * scale - player.x * scale + c.width / 2, this.y * scale - player.y * scale + c.height / 2);
        ctx.rotate(this.angle);
        ctx.fillRect(- 10 * scale / 2, -20 * scale, 10 * scale, 20 * scale);
        ctx.restore();
        ctx.closePath();
    }
}

class Key extends Tool {
    
}

class GravitySwitch extends Tool {
    constructor(x, y, vx, vy, gravity, mass, galaxy, timing){
        super(x, y, vx, vy, gravity, mass, galaxy);
        this.timing = timing;
        this.time = 0;
    }

    update(){
        if(this.timing != this.time){
            this.time ++;
        }
        if(this.entity != null){
            this.x = this.entity.x - Math.cos(this.entity.angle) * 10 * this.entity.right + Math.sin(this.entity.angle) * 5;
            this.y = this.entity.y - Math.sin(this.entity.angle) * 10 * this.entity.right - Math.cos(this.entity.angle) * 5;
            this.angle = this.entity.angle;
        }
    }

    execute(){
        if(this.timing == this.time){
            this.entity.gravity = -this.entity.gravity;
            this.entity.groundPlanet == -1;
            this.entity.jumping == 0;
            this.time = 0;
        }
    }

    draw(player){
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.save();
        ctx.translate(this.x * scale - player.x * scale + c.width / 2, this.y * scale - player.y * scale + c.height / 2);
        ctx.rotate(this.angle);
        ctx.fillRect(- 10 * scale / 2, -20 * scale, 10 * scale, 20 * scale);
        ctx.restore();
        ctx.closePath();
    }
}

//galaxy
class Galaxy {
    constructor(planets, rocks, portals, entities, tools) {
        this.planets = planets;
        this.rocks = rocks;
        this.portals = portals;
        this.entities = entities;
        this.tools = tools;
    
        this.numPlanets = planets.length;
        this.numRocks = rocks.length;
        this.numPortals = portals.length;
        this.numEntities = entities.length;
        this.numTools = tools.length;

        this.editing = false;
    }
    
    addObject(object) {
        switch (object.type) {
            case "planet": 
                this.planets.push(object);
                this.numPlanets++;
                break;
            case "rock":
                this.rocks.push(object);
                this.numRocks++;
                break;
            case "portal":
                this.portals.push(object);
                this.numPortals++;
                break;
            case "entity":
                this.entities.push(object);
                this.numEntities++;
                break;
            case "player":

                this.entities.push(object);
                this.numEntities++;
                break;
            case "tools":
                this.tools.push(object);
                this.numTools++;
                break;
        }
    }

    removeObject(object) {
        switch(object.type){
            case "planet": 
                for (let i = 0; i < this.numPlanets; i++) {
                    if (this.planets[i] === object) {
                        this.planets.splice(i, 1);
                        this.numPlanets--;
                        break; 
                    }
                }
                break;
            
            case "rock":
                for (let i = 0; i < this.numRocks; i++) {
                    if (this.rocks[i] === object) {
                        this.rocks.splice(i, 1);
                        this.numRocks--;
                        break; 
                    }
                }
                break;
            
            case "portal":
                for (let i = 0; i < this.numPortals; i++) {
                    if (this.portals[i] === object) {
                        this.portals.splice(i, 1);
                        this.numPortals--;
                        break; 
                    }
                }
                break;
    
            case "entity":
                for (let i = 0; i < this.numEntities; i++) {
                    if (this.entities[i] === object) {
                        this.entities.splice(i, 1);
                        this.numEntities--;
                        break; 
                    }
                }
                break;
            
            case "tool":
            for (let i = 0; i < this.numTools; i++) {
                if (this.tools[i] === object) {
                    this.tools.splice(i, 1);
                    this.numTools--;
                    break; 
                }
            }
            break;

            case "player":
                for (let i = 0; i < this.numEntities; i++) {
                    if (this.entities[i] === object) {
                        this.entities.splice(i, 1);
                        this.numEntities--;
                        break; 
                    }
                }
                break;
        }
    }

    updateMotion(){

            for (let i = 0; i < this.numPlanets; i++) {
                this.planets[i].updateMotion();
            }
        
            for (let i = 0; i < this.numRocks; i++) {
                this.rocks[i].updateMotion();
            }
        
            for (let i = 0; i < this.numPortals; i++) {
                this.portals[i].updateMotion();
                this.portals[i].checkCollision();
            }
        
            for (let i = 0; i < this.numEntities; i++) {
                this.entities[i].updateMotion();
                this.entities[i].updateStats();
            } 

            for (let i = 0; i < this.numTools; i++) {
                this.tools[i].updateMotion();
            }
        }

    draw(player) {

        ctx.clearRect(0, 0, c.width, c.height);
        ctx.fillStyle = "darkblue";
        ctx.fillRect(0, 0, c.width, c.height);

        for (let i = 0; i < this.numPlanets; i++) {
            this.planets[i].draw(player);
        }
    
        for (let i = 0; i < this.numRocks; i++) {
            this.rocks[i].draw(player);
        }
    
        for (let i = 0; i < this.numPortals; i++) {
            this.portals[i].draw(player);
        }
    
        for (let i = 0; i < this.numEntities; i++) {
            this.entities[i].draw(player);
        }

        for (let i = 0; i < this.numTools; i++) {
            this.tools[i].draw(player);
        }
    }
}

//actions
class Action {

    constructor(timing){
        this.timing = timing;
        this.time = 0;
    }

    tryExecute(entity){
        if(this.time == this.timing){
            this.execute(entity);
            this.time = 0;
        }
    }

    execute(entity){
        ///////////////
    }
}

class MoveLeft extends Action {
    execute(entity){
        entity.right = -1;
        if(entity.groundPlanet != -1){
            entity.vx -= Math.cos(entity.angle) * entity.speed;
            entity.vy -= Math.sin(entity.angle) * entity.speed;
        }
    }
}

class MoveRight extends Action {
    execute(entity){
        entity.right = 1;
        if(entity.groundPlanet != -1){
            entity.vx += Math.cos(entity.angle) * entity.speed;
            entity.vy += Math.sin(entity.angle) * entity.speed;
        }
    }
}

class Jump extends Action {
    execute(entity){
        if((entity.groundPlanet != -1)){
            entity.vx += Math.cos(entity.angle - Math.PI / 2) * entity.jumpC;
            entity.vy += Math.sin(entity.angle - Math.PI / 2) * entity.jumpC;
            entity.jumping = 0;
        }
    }
}

class Mine extends Action {
    execute(entity){
        for(let i = 0; i < levels[entity.galaxy].numRocks; i++){
            if(entity.inventory.total < entity.inventory.max){
                if(entity.hitBox.onSpot("rock", i)){
                    entity.inventory.rocks.push(levels[entity.galaxy].rocks[i]);
                    entity.inventory.max++;
                    levels[entity.galaxy].rocks.splice(i, 1);
                    levels[entity.galaxy].numRocks--;
                    break;
                }
            }
        }
    }
}

class ThrowRock extends Action{
    execute(entity){
        if(entity.inventory.rocks.length > 0){
            let rock = entity.inventory.rocks[0];
            rock.x = entity.x + Math.sin(entity.angle) * 20 + Math.cos(entity.angle) * entity.width * entity.right;
            rock.y = entity.y - Math.cos(entity.angle) * 20 + Math.sin(entity.angle) * entity.width * entity.right;
            rock.throw = entity.id;
            rock.galaxy = entity.galaxy;
            let tvx = Math.cos(entity.angle) * 10 * entity.right;
            let tvy = Math.sin(entity.angle) * 10 * entity.right;
            rock.vx = tvx + entity.vx;
            rock.vy = tvy + entity.vy;
            levels[entity.galaxy].addObject(rock);
            entity.inventory.rocks.splice(0, 1);
            entity.vx -= tvx * 0.5;
            entity.vy -= tvy * 0.5;
        }
    }
}

//identificator
class Identificator {

    constructor(){
        this.id = new Map();
    }

    createId(object){
        this.id.set(object.id, object);
    }

    getObjectFromId(id){
        return this.id.get(id);
    }
}

//edit
class Edit {
    constructor(){
        this.editing = -1;
        this.sliding = false;
        this.zooming = false;
        this.rubber = false;
        this.moving = true;
        this.changingParametres = false;
        this.rChanging = false;
        this.changingObject = -1;
        this.mouseStartX = 0;
        this.mouseStartY = 0;
        this.playerStartX = 0;
        this.playerStartY = 0;
        this.zoomToolX = c.width / 2;
        this.zoomToolY = c.height - 40;

        this.majorBarX = c.width - 200;
        this.majorBarY = 50;
    }

    startEditing(){
        currentLevel.editing = true;
    }

    takeObject(eventListener){

        this.majorBarX + 50, c.height - 100, 100 , 50
        if((eventListener.mouseX > this.majorBarX + 50) && (eventListener.mouseX < this.majorBarX + 150) && (eventListener.mouseY > c.height - 100) && (eventListener.mouseY < c.height - 50)){
            player.x = fakePlayer.x;
            player.y = fakePlayer.y;
            currentLevel.removeObject(fakePlayer);
            currentLevel.addObject(player);
            currentLevel.editing = false;
            scale = 1;
            isEditing = false;
            return;
        }

        if((eventListener.mouseY > this.majorBarY) && (eventListener.mouseY < this.majorBarY + 50)){

            //move
            if((eventListener.mouseX > this.majorBarX - 100) && (eventListener.mouseX < this.majorBarX - 50)){
                this.rubber = false;
                this.moving = true;
                this.adding = false;
                this.changingParametres = false;
                this.editing = -4;
                return;
            }

            //change parameters
            if((eventListener.mouseX > this.majorBarX - 50) && (eventListener.mouseX < this.majorBarX)){
                this.rubber = false;
                this.moving = false;
                this.adding = false;
                this.changingParametres = true;

                this.editing = -4;
                return;
            }

            //addObjects
            if((eventListener.mouseX > this.majorBarX) && (eventListener.mouseX < this.majorBarX + 50)){
                this.rubber = false;
                this.moving = false;
                this.adding = true;
                this.changingParametres = false;
                this.editing = -4;
                return;
            }

            //rubber
            if((eventListener.mouseX > this.majorBarX + 50) && (eventListener.mouseX < this.majorBarX + 100)){
                this.rubber = true;
                this.moving = false;
                this.adding = false;
                this.changingParametres = false;
                this.editing = -3;
                return;
            }
        }

        if((eventListener.mouseX > this.zoomToolX - 60) && (eventListener.mouseX < this.zoomToolX + 60) && (eventListener.mouseY > this.zoomToolY - 15) && (eventListener.mouseY < this.zoomToolY + 75)){

            this.editing = -2;
            this.zooming = true;
            return;
        }

        if(this.moving){
            for(let i = 0; i < currentLevel.numPlanets; i++){
                const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                let dist = Math.sqrt(
                    (mouseWorldX - currentLevel.planets[i].x) ** 2 +
                    (mouseWorldY - currentLevel.planets[i].y) ** 2
                );
                if(dist <= currentLevel.planets[i].r){
                    currentLevel.planets[i].edited = true;
                    this.editing = currentLevel.planets[i].id;
                    return;
                }
            }

            for(let i = 0; i < currentLevel.numPortals; i++){
                const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                const mouseWorldY = eventListener.mouseY / scale + player.y - c.height/ (scale * 2) ;
    
                let dist = Math.sqrt(
                    (mouseWorldX - currentLevel.portals[i].x) ** 2 +
                    (mouseWorldY - currentLevel.portals[i].y) ** 2
                );
                if(dist <= currentLevel.portals[i].r){
                    currentLevel.portals[i].edited = true;
                    this.editing = currentLevel.portals[i].id;
                    return;
                }
            }
    
            for(let i = 0; i < currentLevel.numTools; i++){
                if(currentLevel.tools[i] != player){
                    const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                    const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                    let dist = Math.sqrt(
                        (mouseWorldX - currentLevel.tools[i].x) ** 2 +
                        (mouseWorldY - currentLevel.tools[i].y) ** 2
                    );
                    if(dist <= 20){
                        currentLevel.tools[i].edited = true;
                        this.editing = currentLevel.tools[i].id;
                        return;
                    }
                }
            }
    
            for(let i = 0; i < currentLevel.numEntities; i++){
                if(currentLevel.entities[i] != player){
                    const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                    const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                    let dist = Math.sqrt(
                        (mouseWorldX - currentLevel.entities[i].x) ** 2 +
                        (mouseWorldY - currentLevel.entities[i].y) ** 2
                    );
                    if(dist <= 20){
                        currentLevel.entities[i].edited = true;
                        this.editing = currentLevel.entities[i].id;
                        return;
                    }
                }
            }
        }

        if(this.rubber){
            for(let i = 0; i < currentLevel.numPlanets; i++){
                const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                let dist = Math.sqrt(
                    (mouseWorldX - currentLevel.planets[i].x) ** 2 +
                    (mouseWorldY - currentLevel.planets[i].y) ** 2
                );
                if(dist <= currentLevel.planets[i].r){
                    currentLevel.removeObject(currentLevel.planets[i]);
                    return;
                }
            }

            for(let i = 0; i < currentLevel.numPortals; i++){
                const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                let dist = Math.sqrt(
                    (mouseWorldX - currentLevel.portals[i].x) ** 2 +
                    (mouseWorldY - currentLevel.portals[i].y) ** 2
                );

                if(dist <= currentLevel.portals[i].r){
                    currentLevel.removeObject(currentLevel.portals[i]);
                    return;
                }
            }
    
            for(let i = 0; i < currentLevel.numTools; i++){
                if(currentLevel.tools[i] != player){
                    const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                    const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                    let dist = Math.sqrt(
                        (mouseWorldX - currentLevel.tools[i].x) ** 2 +
                        (mouseWorldY - currentLevel.tools[i].y) ** 2
                    );
                    if(dist <= 50){
                        console.log("eyo");
                        currentLevel.removeObject(currentLevel.tools[i]);
                        return;
                    }
                }
            }
    
            for(let i = 0; i < currentLevel.numEntities; i++){
                if(currentLevel.entities[i] != player){
                    const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                    const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                    let dist = Math.sqrt(
                        (mouseWorldX - currentLevel.entities[i].x) ** 2 +
                        (mouseWorldY - currentLevel.entities[i].y) ** 2
                    );
                    if(dist <= 50){
                        console.log("eyo");
                        currentLevel.removeObject(currentLevel.entities[i]);
                        return;
                    }
                }
            }
        }

        if(this.adding){
            let dist = Math.sqrt((eventListener.mouseX - 100) ** 2 + (eventListener.mouseY - 75) ** 2);
            if(dist < 50){
                let planet = new Planet(100, 75, 0, 0, false, 200, 50, "rock", 1, 0.95);
                currentLevel.addObject(planet);
                this.editing = planet.id;
                return;
            }
        }

        if(this.changingParametres){

            if(this.changingObject >= 1){
                let object = identificator.getObjectFromId(this.changingObject);
                switch(object.type){
                    case "planet":
                        /*
                        ctx.beginPath();
                        ctx.fillStyle = "white";
                        ctx.fillRect(object.x * scale - 150 - player.x * scale + c.width / 2, object.y * scale - object.r * scale - 170 - player.y * scale + c.height / 2, 300, 150);
                        ctx.restore();
                        ctx.closePath();
                        
                        ctx.beginPath();
                        ctx.fillStyle = "red";
                        ctx.fillRect(object.x * scale - 140 - player.x * scale + c.width / 2 , object.y * scale - object.r * scale - 150 - player.y * scale + c.height / 2, 120 , 5);
                        ctx.restore();
                        ctx.closePath();

                        ctx.beginPath();
                        ctx.fillStyle = "black";
                        ctx.fillRect(object.x * scale - 140 - player.x * scale + c.width / 2 + object.r / 5, object.y * scale - object.r * scale - 151 - player.y * scale + c.height / 2, 2 , 8);
                        ctx.restore();
                        ctx.closePath();*/
                    if((eventListener.mouseX > object.x * scale - 150 - player.x * scale + c.width / 2) && (eventListener.mouseX < object.x * scale + 150 - player.x * scale + c.width / 2)){
                        if((eventListener.mouseY > object.y * scale - object.r * scale - 170 - player.y * scale + c.height / 2) && (eventListener.mouseY < object.y * scale - object.r * scale - 20 - player.y * scale + c.height / 2)){

                            if((eventListener.mouseX > object.x * scale - 140 - player.x * scale + c.width / 2) && (eventListener.mouseX < object.x * scale + 100 - player.x * scale + c.width / 2)){
                                if((eventListener.mouseY > object.y * scale - object.r * scale - 155 - player.y * scale + c.height / 2) && (eventListener.mouseY < object.y * scale - object.r * scale - 145 - player.y * scale + c.height / 2)){
                                    this.rChanging = true;
                                    return;
                                }
                            }
                            return;
                        }
                    }
                }
            }

            for(let i = 0; i < currentLevel.numPlanets; i++){
                const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                let dist = Math.sqrt(
                    (mouseWorldX - currentLevel.planets[i].x) ** 2 +
                    (mouseWorldY - currentLevel.planets[i].y) ** 2
                );
                if(dist <= currentLevel.planets[i].r){
                    this.changingObject = currentLevel.planets[i].id;
                    return;
                }
            }

            for(let i = 0; i < currentLevel.numPortals; i++){
                const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                let dist = Math.sqrt(
                    (mouseWorldX - currentLevel.portals[i].x) ** 2 +
                    (mouseWorldY - currentLevel.portals[i].y) ** 2
                );

                if(dist <= currentLevel.portals[i].r){
                    this.changingObject = currentLevel.portals[i].id;
                    return;
                }
            }
    
            for(let i = 0; i < currentLevel.numTools; i++){
                if(currentLevel.tools[i] != player){
                    const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                    const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                    let dist = Math.sqrt(
                        (mouseWorldX - currentLevel.tools[i].x) ** 2 +
                        (mouseWorldY - currentLevel.tools[i].y) ** 2
                    );
                    if(dist <= 50){
                        this.changingObject = currentLevel.tools[i].id;
                        return;
                    }
                }
            }
    
            for(let i = 0; i < currentLevel.numEntities; i++){
                if(currentLevel.entities[i] != player){
                    const mouseWorldX = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
                    const mouseWorldY = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
    
                    let dist = Math.sqrt(
                        (mouseWorldX - currentLevel.entities[i].x) ** 2 +
                        (mouseWorldY - currentLevel.entities[i].y) ** 2
                    );
                    if(dist <= 50){
                        this.changingObject = currentLevel.entities[i].id;
                        return;
                    }
                }
            }
            this.changingObject = -1;
        }

        this.sliding = true;
        this.mouseStartX = eventListener.mouseX;
        this.mouseStartY = eventListener.mouseY;
        this.playerStartX = player.x;
        this.playerStartY = player.y;
    }

    leaveObject(){
        if(this.editing > 0){
            identificator.getObjectFromId(this.editing).edited = false;
            this.editing = -1;
        }
        else{
            this.sliding = false;
            this.zooming = false;
            this.editing = -1;
            this.rChanging = false;
        }
    }

    update(eventListener){
        if(this.editing > 0){
            identificator.getObjectFromId(this.editing).x = eventListener.mouseX / scale + player.x - c.width / (scale * 2);
            identificator.getObjectFromId(this.editing).y = eventListener.mouseY / scale + player.y - c.height / (scale * 2);
        }

        if(this.sliding){
            player.x = this.playerStartX - eventListener.mouseX / scale + this.mouseStartX / scale;
            player.y = this.playerStartY - eventListener.mouseY / scale + this.mouseStartY / scale;
        }

        if(this.zooming){
            if(eventListener.mouseX < this.zoomToolX - 65){
                scale = 0.1;
            }
            else if(eventListener.mouseX > this.zoomToolX + 65){
                scale = 2.0;
            }
            else{
                scale = ((eventListener.mouseX - this.zoomToolX + 65) / 60);
            }
        }

        if(this.rChanging){
            let object = identificator.getObjectFromId(this.changingObject);
            if(eventListener.mouseX < object.x * scale - 140 - player.x * scale + c.width / 2){
                object.r = 1;
            }
            else if(eventListener.mouseX > object.x * scale + 100 - player.x * scale + c.width / 2){
                object.r = 1000;
            }
            else{
                object.r = (eventListener.mouseX - (object.x * scale - 140 - player.x * scale + c.width / 2)) * 5;
            }
        }
    }

    drawEditingTools(){
        //zoom tool
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(this.zoomToolX - 60, this.zoomToolY, 120 , 30);
        ctx.restore();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(this.zoomToolX - 65 + 60 * scale, this.zoomToolY - 15, 10 , 60);
        ctx.restore();
        ctx.closePath();

        //creative tools

        //major bar
        if(this.adding){
            //general
            ctx.beginPath();
            ctx.fillStyle = "green";
            ctx.fillRect(0, 0, c.width , 150);
            ctx.restore();
            ctx.closePath();

            //planets
            ctx.beginPath();
            ctx.fillStyle = "brown";
            ctx.arc(100, 75, 50, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }

        //moving 
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(this.majorBarX - 100, this.majorBarY, 50 , 50);
        ctx.restore();
        ctx.closePath();

        //change objects
        ctx.beginPath();
        ctx.fillStyle = "grey";
        ctx.fillRect(this.majorBarX - 50, this.majorBarY, 50 , 50);
        ctx.restore();
        ctx.closePath();

        //changing object bar
        if(this.changingParametres && this.changingObject >= 1){

            let object = identificator.getObjectFromId(this.changingObject);

            switch(object.type){
                case "planet": 
                //cloud
                ctx.beginPath();
                ctx.fillStyle = "white";
                ctx.fillRect(object.x * scale - 150 - player.x * scale + c.width / 2, object.y * scale - object.r * scale - 170 - player.y * scale + c.height / 2, 300, 150);
                ctx.restore();
                ctx.closePath();

                //r operator
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.fillRect(object.x * scale - 140 - player.x * scale + c.width / 2 , object.y * scale - object.r * scale - 150 - player.y * scale + c.height / 2, 240 , 5);
                ctx.restore();
                ctx.closePath();

                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.fillRect(object.x * scale - 140 - player.x * scale + c.width / 2 + object.r / 5, object.y * scale - object.r * scale - 151 - player.y * scale + c.height / 2, 2 , 8);
                ctx.restore();
                ctx.closePath();

                break;
            }
        }

        //objects
        ctx.beginPath();
        ctx.fillStyle = "darkgrey";
        ctx.fillRect(this.majorBarX, this.majorBarY, 50 , 50);
        ctx.restore();
        ctx.closePath();

        //rubber
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(this.majorBarX + 50, this.majorBarY, 50 , 50);
        ctx.restore();
        ctx.closePath();

        //start playing
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.majorBarX + 50, c.height - 100, 100 , 50);
        ctx.restore();
        ctx.closePath();


    }
}

//actions
const allActions = {
    "moveLeft": new MoveLeft(0),
    "moveRight": new MoveRight(0),
    "jump": new Jump(50),
    "mine": new Mine(0),
    "throw": new ThrowRock(30)
};

//identificator
let identificator = new Identificator();

//predef levels
const levels = [

    //home
    new Galaxy(
        [
            new Planet(720, 1700, 0, 0, false, 10000, 1000, "rock", 0, 0.90),

            new Planet(250, 400, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(720, 250, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(1200, 400, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(250, -200, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(900, -300, 0, 0, false, 400, 100, "metal", 0, 0.80),
            new Planet(1400, 0, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(-100, 150, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(-200, -500, 0, 0, false, 200, 100, "rock", 0, 0.80),

            new Planet(-700, 1000, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(-800, 1700, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(-700, 2300, 0, 0, false, 200, 100, "rock", 0, 0.80),

            new Planet(-500, 500, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(-200, 2900, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(300, 3100, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(-200, 700, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(-700, 3100, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(-1300, 1000, 0, 0, false, 800, 200, "gravitanium", 0, 0.80),
            new Planet(-1300, 1800, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(2000, 2700, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(1500, 2900, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(800, 3100, 0, 0, false, 400, 100, "metal", 0, 0.80),
            new Planet(300, 3100, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(1200, 3400, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(1900, 400, 0, 0, false, 300, 150, "rock", 0, 0.80),
            new Planet(2000, 900, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(2100, 1400, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(2500, 900, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(2200, 1800, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(2700, 1300, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(2600, 2000, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(2000, 2200, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(1900, -100, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(2300, 100, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(2700, 300, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(400, 3500, 0, 0, false, 200, 100, "rock", 0, 0.80),
            new Planet(2000, 3200, 0, 0, false, 700, 250, "rock", 0, 0.80)
        ],
        [
            new Rock(0, 0, 0, 0, true, 20, 10, "metal", 0, -1)
        ],
        [
            new Portal(750, 100, 0, 0, false, 1, 20, "portal", 0, 1, 0, -200),
            new Portal(750, 600, 0 ,0, false, 1, 20, "portal", 0, 1, 0, -200),
        ],
        [],
        [
            new Jetpack(700, 700, 0, 0, true, 1, 0, 50, 10)
        ]
    ),
    new Galaxy(
        [
            new Planet(0, 0, 0, 0, false, 1000, 200, "rock", 1, 0.90),
            new Planet(-700, 1000, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(-800, 1700, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(-700, 2300, 0, 0, false, 200, 100, "rock", 1, 0.80),

            new Planet(-500, 500, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(-200, 2900, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(300, 3100, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(-200, 700, 0, 0, false, 200, 100, "rock", 1, 0.80),

            new Planet(800, 3100, 0, 0, false, 400, 100, "metal", 1, 0.80),
            new Planet(300, 3100, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(1200, 3400, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(1900, 400, 0, 0, false, 300, 150, "rock", 1, 0.80),
            new Planet(2000, 900, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(2100, 1400, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(2500, 900, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(2200, 1800, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(2700, 1300, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(2600, 2000, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(2000, 2200, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(1900, -100, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(2300, 100, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(2700, 300, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(400, 3500, 0, 0, false, 200, 100, "rock", 1, 0.80),
            new Planet(2000, 3200, 0, 0, false, 700, 250, "rock", 1, 0.80)

        ],
        [],
        [
            new Portal(0, -250, 0, 0, false, 1, 20, "portal", 1, 0, 500, 500),
        ],
        [],
        [
            new GravitySwitch(0, 0, 0, 0, true, 1, 1, 10),
        ]
    )
];

eventListener = new EventListener();
let currentLevel = levels[1];
let player = new Player(0, 0, 1, 0 , true, 1, 1, 40, 20, 10, 50, 6);
let edit = new Edit();
let fakePlayer = new NPC(0, 0, 0, 0 , true, 1, 1, 40, 20, 10, 50, 6);

currentLevel.addObject(player);
edit.startEditing();

function normalGalaxyPlaying(){
    currentLevel.updateMotion();
    eventListener.keyBoard(player);
    currentLevel.draw(player);
}

function editing(){
    edit.update(eventListener);
    currentLevel.draw(player);
    edit.drawEditingTools();
}

currentLevel.removeObject(player);
fakePlayer.galaxy = currentLevel.id;
currentLevel.addObject(fakePlayer);
edit.startEditing;

//game loop
function gameLoop(){

    if(isEditing){
        editing();
    }
    else{
        normalGalaxyPlaying();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
