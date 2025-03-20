const c = document.getElementById("gameCanvas");
        const ctx = c.getContext("2d");
        let G = 10;

        let arrowUp = false;
        let arrowLeft = false;
        let arrowRight = false;

        let enemyUp = false;
        let enemyLeft = false;
        let enemyRight = false;

        let allowPassing = 10;

        let maxVelocity = 7;

        let minVelocity = -7;

        class Level {

            constructor(planets, portals) {

                this.planets = planets;
                this.portals = portals;
            }

            get numPlanets() {
                return this.planets.length;
            }

            get numPortals() {
                return this.portals.length;
            }
        }

        const levels = {
            "home": new Level(
                [
                    { x: 720, y: 850, r: 300, mass: 800, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 250, y: 400, r: 100, mass: 150, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 720, y: 250, r: 100, mass: 150, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 1200, y: 400, r: 100, mass: 150, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false}
                ],
                [
                    { x: 100, y: 170, r: 20, index: "1", xIndex: 20, yIndex: 20 },
                    { x: 300, y: 130, r: 20, index: "2", xIndex: 20, yIndex: 20 },
                    { x: 600, y: 50, r: 20, index: "3", xIndex: 20, yIndex: 20 }
                ],
                []
            ),
        
            "1": new Level(
                [
                    { x: 200, y: 100, r: 70, mass: 300, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 600, y: 100, r: 40, mass: 350, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 200, y: 500, r: 180, mass: 700, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 600, y: 500, r: 30, mass: 100, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false}
                ],
                [
                    { x: 50, y: 50, r: 20, index: "home", xIndex: 20, yIndex: 20 },
                    { x: 200, y: 200, r: 20, index: "2", xIndex: 20, yIndex: 20 }
                ],
                []
            ),
        
            "2": new Level(
                [
                    { x: 650, y: 400, r: 50, mass: 20, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 250, y: 250, r: 100, mass: 400, vx: 0, vy: 0, ax:0, ay: 0, gravity: false},
                    { x: 1000, y: 250, r: 100, mass: 400, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 250, y: 600, r: 100, mass: 400, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 1000, y: 600, r: 100, mass: 400, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 100, y: 100, r: 30, mass: 200, vx: 0, vy: 0, ax: 0, ay: 0, gravity: true},

                ],
                [

                ],
                [
                    { x: 100, y: 100, r: 10, mass: 20, vx: 10, vy: 10}
                ]
            ),

            "3": new Level(
                [
                    { x: 300, y: 300, r: 120, mass: 500, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false},
                    { x: 500, y: 500, r: 80, mass: 400, vx: 0, vy: 0, ax: 0, ay: 0, gravity: false}
                ],
                [
                    { x: 400, y: 200, r: 20, index: "home", xIndex: 20, yIndex: 20}
                ],
                []
            )
        };

        let currentLevel = levels["home"];

        let player = { 
            x: 680,          
            y: 600,            
            width: 20,       
            height: 40,      
            vx: 0,           
            vy: 0,           
            speed: 10,         
            mass: 5,  
            ax: 0,
            ay: 0,         
            gx: 0,           
            gy: 0,           
            onGround: false,
            angle: 0,
            groundPlanet: -1,
            traveling: 0
        };

        let enemy = {
            x: 700,          
            y: 100,            
            width: 20,       
            height: 40,      
            vx: 0,           
            vy: 0,           
            speed: 2,         
            mass: 5,  
            ax: 0,
            ay: 0,         
            gx: 0,           
            gy: 0,           
            onGround: false,
            angle: 0,
            groundPlanet: -1,
        }

        //nemico 
        function enemyForces(){
            enemy.gx = 0;
            enemy.gy = 0;

            for (let j = 0; j < currentLevel.numPlanets; j++) {
                let dx = currentLevel.planets[j].x - enemy.x;
                let dy = currentLevel.planets[j].y - enemy.y;
                let distSquared = dx * dx + dy * dy;
                let dist = Math.sqrt(distSquared);

                let nx = dx / dist;
                let ny = dy / dist;

                if (dist > currentLevel.planets[j].r + 5) { 
                    let g = (G * currentLevel.planets[j].mass) / distSquared; 
                    enemy.gx += g * (dx / dist); 
                    enemy.gy += g * (dy / dist);
                } 
                else {
                    enemy.groundPlanet = j;
                    enemy.onGround = true;
                    enemy.vx = 0;
                    enemy.vy = 0;
                }
            }
        }

        function updateEnemy(){
            if(enemy.groundPlanet == -1){
                enemy.x += enemy.vx;
                enemy.y += enemy.vy;
                enemy.angle = angle - Math.PI / 2;
                enemy.ax = enemy.gx;
                enemy.ay = enemy.gy;  
                enemy.vx += enemy.ax;
                enemy.vy += enemy.ay;
            }

            else{
                planetIndex = enemy.groundPlanet;
                let dx = currentLevel.planets[planetIndex].x - enemy.x;
                let dy = currentLevel.planets[planetIndex].y - enemy.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                enemy.angle = (Math.atan2(dy, dx) - Math.PI / 2);

                if(dist - currentLevel.planets[planetIndex].r < -1){
                    console.log(dist - currentLevel.planets[planetIndex].r);

                    enemy.x = currentLevel.planets[planetIndex].x + (currentLevel.planets[planetIndex].r) * Math.cos(enemy.angle - 1/2 * Math.PI);
                    enemy.y = currentLevel.planets[planetIndex].y + (currentLevel.planets[planetIndex].r) * Math.sin(enemy.angle - 1/2 * Math.PI);
                }

                if(enemyLeft){
                    enemy.vx -= Math.cos(enemy.angle) * enemy.speed;
                    enemy.vy -= Math.sin(enemy.angle) * enemy.speed;
                }

                if(enemyRight){
                    enemy.vx += Math.cos(enemy.angle) * enemy.speed;
                    enemy.vy += Math.sin(enemy.angle) * enemy.speed;
                }

                if (enemyUp) {
                    let norm = Math.sqrt(dx * dx + dy * dy);
                    let nx = dx / norm; 
                    let ny = dy / norm; 

                    enemy.vx = -nx * 5;
                    enemy.vy = -ny * 5;

                    enemy.x += enemy.vx;
                    enemy.y += enemy.vy;
                }
            }
        }

        //giocatore
        function playerForces(){
            player.gx = 0;
            player.gy = 0;
            player.groundPlanet = -1;
            player.onGround = false;
            

            for (let j = 0; j < currentLevel.numPlanets; j++) {
                let dx = currentLevel.planets[j].x - player.x;
                let dy = currentLevel.planets[j].y - player.y;
                let distSquared = dx * dx + dy * dy;
                let dist = Math.sqrt(distSquared);

                let nx = dx / dist;
                let ny = dy / dist;

                if (dist > currentLevel.planets[j].r) { 
                    let g = (G * currentLevel.planets[j].mass) / distSquared; 
                    player.gx += g * (dx / dist); 
                    player.gy += g * (dy / dist);
                } 
                else {
                    player.vx = 0;
                    player.vy = 0;
                    player.groundPlanet = j;
                    player.onGround = true;
                }
            }

            angle = Math.atan2(player.gy, player.gx);
        }

        function updatePlayer(){
            if(player.groundPlanet == -1){
                player.x += player.vx;
                player.y += player.vy;
                player.angle = angle - Math.PI / 2;
                player.ax = player.gx;
                player.ay = player.gy;  
                player.vx += player.ax;
                player.vy += player.ay;

                if(player.vx > maxVelocity){
                    player.vx = maxVelocity;
                }

                if(player.vy > maxVelocity){
                    player.vy = maxVelocity;
                }

                if(player.vx < minVelocity){
                    player.vx = minVelocity;
                }

                if(player.vx < minVelocity){
                    player.vx = minVelocity;
                }
            }

            else{
                planetIndex = player.groundPlanet;
                let dx = currentLevel.planets[planetIndex].x - player.x;
                let dy = currentLevel.planets[planetIndex].y - player.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                    
                player.vx += currentLevel.planets[planetIndex].vx;
                player.vy += currentLevel.planets[planetIndex].vy;
                

                player.x += player.vx;
                player.y += player.vy;

                player.angle = (Math.atan2(dy, dx) - Math.PI / 2);

                if(dist - currentLevel.planets[planetIndex].r < -1){
                    console.log(dist - currentLevel.planets[planetIndex].r);

                    player.x = currentLevel.planets[planetIndex].x + (currentLevel.planets[planetIndex].r) * Math.cos(player.angle - 1/2 * Math.PI);
                    player.y = currentLevel.planets[planetIndex].y + (currentLevel.planets[planetIndex].r) * Math.sin(player.angle - 1/2 * Math.PI);
                }

                if(arrowLeft){
                    player.x -= Math.cos(player.angle) * player.speed;
                    player.y -= Math.sin(player.angle) * player.speed;
                }

                if(arrowRight){
                    player.x += Math.cos(player.angle) * player.speed;
                    player.y += Math.sin(player.angle) * player.speed;
                }

                if (arrowUp) {
                    let norm = Math.sqrt(dx * dx + dy * dy);
                    let nx = dx / norm; 
                    let ny = dy / norm; 

                    player.vx += -nx * 5;
                    player.vy += -ny * 5;

                    player.x += player.vx;
                    player.y += player.vy;
                }
            }
        }

        function updatePlanets() {

            for(let i=0; i < currentLevel.numPlanets; i++){

                let planet = currentLevel.planets[i];

                currentLevel.planets[i].x += currentLevel.planets[i].vx;
                currentLevel.planets[i].y += currentLevel.planets[i].vy;

                currentLevel.planets[i].vx += currentLevel.planets[i].ax;
                currentLevel.planets[i].vy += currentLevel.planets[i].ay;

                if(planet.vx > maxVelocity){
                    planet.vx = maxVelocity;
                }

                if(planet.vy > maxVelocity){
                    planet.vy = maxVelocity;
                }

                if(planet.vx < minVelocity){
                    planet.vx = minVelocity;
                }

                if(planet.vy < minVelocity){
                    planet.vy = minVelocity;
                }

                if(currentLevel.planets[i].gravity){

                    planet.ax = 0;
                    planet.ay = 0;

                    for (let j = 0; j < currentLevel.numPlanets; j++) {
                        let dx = currentLevel.planets[j].x - planet.x;
                        let dy = currentLevel.planets[j].y - planet.y;
                        let distSquared = dx * dx + dy * dy;
                        let dist = Math.sqrt(distSquared);
                        if (dist > currentLevel.planets[j].r) { 
                            let g = (G * currentLevel.planets[j].mass) / distSquared; 
                            planet.ax += g * (dx / dist); 
                            planet.ay += g * (dy / dist);
                        } 
                        else {
                        }
                    }
                }
            }
        }

        function checkPortalCollision() {

            for(let i=0; i < currentLevel.numPortals; i++){
                let dx = currentLevel.portals[i].x - player.x;
                let dy = currentLevel.portals[i].y - player.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if(dist <= currentLevel.portals[i].r + player.width){
                    player.x = currentLevel.portals[i].xIndex;
                    player.y = currentLevel.portals[i].yIndex;
                    currentLevel = levels[currentLevel.portals[i].index];
                    allowPassing = 0;
                    console.log(currentLevel);
                }
            }
        }

        function gameLoop(){
            playerForces();
            updatePlayer();
            enemyForces();
            updateEnemy();
            updatePlanets();

            if(allowPassing == 20){
                checkPortalCollision();
            }
            else{allowPassing++;}

            draw();
            console.log(player.y);
            console.log(player.onGround);
            console.log(player.ay);
            arrowRight = false;
            arrowLeft = false;
            arrowUp = false;
            requestAnimationFrame(gameLoop);
        }

        function drawPlanets(){
            for (let i = 0; i < currentLevel.numPlanets; i++) {
                ctx.beginPath();
                ctx.arc(currentLevel.planets[i].x, currentLevel.planets[i].y, currentLevel.planets[i].r, 0, Math.PI * 2);
                ctx.fillStyle = "blue";
                ctx.fill();
                ctx.closePath();
            }
        }

        function drawPortals(){
            for (let i = 0; i < currentLevel.numPortals; i++) {
                ctx.beginPath();
                ctx.arc(currentLevel.portals[i].x, currentLevel.portals[i].y, currentLevel.portals[i].r, 0, Math.PI * 2);
                ctx.fillStyle = "yellow";
                ctx.fill();
                ctx.closePath();
            }
        }

        function draw(){
            ctx.clearRect(0, 0, c.width, c.height);
            drawPlanets();
            drawPortals();
            drawPlayer();
        }

        function drawPlayer(){
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.save();
            ctx.translate(player.x, player.y);
            ctx.rotate(player.angle);
            ctx.fillRect(-player.width / 2, -player.height, player.width, player.height);
            ctx.restore();
            ctx.closePath();
        }

        function drawEnemy(){
            ctx.beginPath();
            ctx.fillStyle = "purple";
            ctx.save();
            ctx.translate(enemy.x, enemy.y);
            ctx.rotate(enemy.angle);
            ctx.fillRect(-enemy.width / 2, -enemy.height, enemy.width, enemy.height);
            ctx.restore();
            ctx.closePath();
        }

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
                    arrowUp = true;
                    break;

                case 'a':
                    arrowLeft = true;
                    break;
                case 'd':
                    arrowRight = true;
                    break;
            }
        });

        gameLoop();
