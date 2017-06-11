///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //

// TODO: DECLARE and INTIALIZE your constants here
var START_TIME = currentTime();
var TITLE = loadImage("cdd_title.png");
var BACKGROUND = loadImage("cdd_background.png");
//var PLAYER_SPRITES = loadImage("cron_spritesheet_mattel.png");
var PLAYER_SPRITES = loadImage("cron_spritesheet_mattel_red.png");
var NPC_SPRITES = loadImage("cron_spritesheet_mattel_violet.png");
var NUM_NPCS = 3;


///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

// TODO: DECLARE your variables here
var lastKeyCode;
var startTime = currentTime();

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

defineFont("intellec", "intellec");

// When setup happens...
function onSetup() {
    // TODO: INITIALIZE your variables here
    lastKeyCode = 0;

    game = makeObject();
    game.state = -1;  // -1:title, 0:playing, 4:ended
    game.life = 100;
    game.stage = 0;
    game.score = 0;

    player = makeObject();
    player.speed = 10;
    player.action = 0; 
    player.height = 90;

    player.pos = makeObject();
    player.pos.x = screenWidth/2;
    player.pos.y = screenHeight-300;
    player.pos.dir = 1;

    player.key = makeObject();
    player.key.left = makeObject();
    player.key.left.code = asciiCode('A');
    player.key.left.pressed = false;
    player.key.right = makeObject();
    player.key.right.code = asciiCode('D');
    player.key.right.pressed = false;
    player.key.up = makeObject();
    player.key.up.code = asciiCode('W');
    player.key.up.pressed = false;
    player.key.down = makeObject();
    player.key.down.code = asciiCode('S');
    player.key.down.pressed = false;

    // issue: add key bindings here

    player.sprites = new Array();
    for (i=0;i<16;i++) {
        player.sprites[i] = new Object();
        //player.sprites[i].x = 5;
        if (i < 8) 
            player.sprites[i].y = 2;
        else
            player.sprites[i].y = 65;
        player.sprites[i].w = 26;
        player.sprites[i].h = 32;
    } 
    player.sprites[0].x = 5;
    player.sprites[1].x = 33;
    player.sprites[2].x = 62;
    player.sprites[3].x = 89;
    player.sprites[4].x = 119;
    player.sprites[5].x = 147;
    player.sprites[6].x = 176;
    player.sprites[7].x = 204;

    player.sprites[8].x = 5;
    player.sprites[9].x = 33;
    player.sprites[10].x = 62;
    player.sprites[11].x = 89;
    player.sprites[12].x = 119;
    player.sprites[13].x = 147;
    player.sprites[14].x = 176;
    player.sprites[15].x = 204;

    player.sprite_index = 0;

    disc = makeObject();
    disc.speed = 30;
    disc.state = 0;
    disc.action = 0;

    disc.pos = makeObject();
    disc.pos.x = screenWidth/2;
    disc.pos.y = screenHeight-300;

    disc.vel = makeObject();
    disc.vel.x = 0;
    disc.vel.y = 0;

    disc.key = makeObject();
    disc.key.left = makeObject();
    disc.key.left.code = asciiCode('J');
    disc.key.left.pressed = false;
    disc.key.right = makeObject();
    disc.key.right.code = asciiCode('L');
    disc.key.right.pressed = false;
    disc.key.up = makeObject();
    disc.key.up.code = asciiCode('I');
    disc.key.up.pressed = false;
    disc.key.down = makeObject();
    disc.key.down.code = asciiCode('K');
    disc.key.down.pressed = false;


    // issue: add npcs here
    npc = makeArray(); 
    for (i=0;i<NUM_NPCS;i++) {
        npc[i] = makeObject();
        npc[i].speed = 10;
        npc[i].action = 0; 
        npc[i].height = 90;
        npc[i].markTime = currentTime();

        npc[i].pos = makeObject();
        npc[i].pos.x = screenWidth/2-(i*150);
        npc[i].pos.y = screenHeight-900;
        npc[i].pos.dir = 1;

        npc[i].vel = makeObject();
        npc[i].vel.x = 0;
        npc[i].vel.y = 0;
    
        npc[i].sprite_index = 0;

        npc[i].disc = makeObject();
        npc[i].disc.speed = 30;
        npc[i].disc.state = 0;
        npc[i].disc.action = 0;

        npc[i].disc.pos = makeObject();
        npc[i].disc.pos.x = screenWidth/2;
        npc[i].disc.pos.y = screenHeight-300;

        npc[i].disc.vel = makeObject();
        npc[i].disc.vel.x = 0;
        npc[i].disc.vel.y = 0;
    }


}


// When a key is pushed
function onKeyStart(key) {
    lastKeyCode = key;
    if (key == player.key.left.code) {
        player.key.left.pressed = true;
    }
    if (key == player.key.right.code) {
        player.key.right.pressed = true;
    }
    if (key == player.key.up.code) {
        player.key.up.pressed = true;
    }
    if (key == player.key.down.code) {
        player.key.down.pressed = true;
    }
    if (key == disc.key.left.code) {
        disc.key.left.pressed = true;
    }
    if (key == disc.key.right.code) {
        disc.key.right.pressed = true;
    }
    if (key == disc.key.up.code) {
        disc.key.up.pressed = true;
    }
    if (key == disc.key.down.code) {
        disc.key.down.pressed = true;
    }
}


function onKeyEnd(key) { 
    if (key == player.key.left.code) {
        player.key.left.pressed = false;
    }
    if (key == player.key.right.code) {
        player.key.right.pressed = false;
    }
    if (key == player.key.up.code) {
        player.key.up.pressed = false;
    }
    if (key == player.key.down.code) {
        player.key.down.pressed = false;
    }
    if (key == disc.key.left.code) {
        disc.key.left.pressed = false;
        disc.action = 1;
    }
    if (key == disc.key.right.code) {
        disc.key.right.pressed = false;
        disc.action = 2;
    }
    if (key == disc.key.up.code) {
        disc.key.up.pressed = false;
        disc.action = 3;
    }
    if (key == disc.key.down.code) {
        disc.key.down.pressed = false;
        disc.action = 4;
    }
}

// Called 30 times or more per second
function onTick() {

    // mvc sucks, keep it real
    controls();
    ai();
    animate();
    display(); 


}

function controls() {

    if (game.state < 0) {
        if ((player.key.left.pressed)||(player.key.right.pressed)) game.state = 0;
    }
    else if (!game.state) {
        // user controls 
        // issue: player controls should be velocities, integrations should be in animation function
        player.action = 0;
        if (player.key.left.pressed) {
            player.pos.x -= player.speed; 
            player.pos.dir = -1;
            player.action = 1;
        }
        if (player.key.right.pressed) {
            player.pos.x += player.speed; 
            player.pos.dir = 1;
            player.action = 2;
        }
        if (player.key.up.pressed) {
            player.pos.y -= player.speed; 
            player.action = 3;
        }
        if (player.key.down.pressed) {
            player.pos.y += player.speed; 
            player.action = 4;
        }
        if (disc.action) {
            if (disc.state == 0) { // held
                //disc.pos.x = player.pos.x;
                //disc.pos.y = player.pos.y;
                disc.vel.x = 0;
                disc.vel.y = 0;
                if (disc.action == 1)
                    disc.vel.x = -disc.speed;
                else if (disc.action == 2)
                    disc.vel.x = disc.speed;
                else if (disc.action == 3)
                    disc.vel.y = -disc.speed;
                else if (disc.action == 4)
                    disc.vel.y = disc.speed;
                if ((disc.key.left.pressed)&&(disc.action>2)) {
                    disc.vel.x = -disc.speed * Math.sin(Math.PI/4);
                    disc.vel.y *= Math.sin(Math.PI/4);
                }
                if ((disc.key.right.pressed)&&(disc.action>2)) {
                    disc.vel.x = disc.speed * Math.sin(Math.PI/4);
                    disc.vel.y *= Math.sin(Math.PI/4);
                }
                if ((disc.key.up.pressed)&&(disc.action<=2)) {
                    disc.vel.y = -disc.speed * Math.sin(Math.PI/4);
                    disc.vel.x *= Math.sin(Math.PI/4);
                }
                if ((disc.key.down.pressed)&&(disc.action<=2)) {
                    disc.vel.y = disc.speed * Math.sin(Math.PI/4);
                    disc.vel.x *= Math.sin(Math.PI/4);
                }
                disc.state = 1;
            }
            else if (disc.state == 1) { // thrown
                disc.state = 2;
            }
            disc.action = 0;
        }
    }

}

function ai() {

    if (!game.state) {
        for(i=0;i<npc.length;i++)  {
            if (currentTime() > npc[i].markTime + 1) { 
                npc[i].action = Math.round(Math.random()*8); 
                npc[i].markTime = currentTime();
            }
            npc[i].vel.x = 0; 
            npc[i].vel.y = 0; 
            if ((npc[i].action == 1)||(npc[i].action == 5)||(npc[i].action == 8)) {
                npc[i].vel.x = -npc[i].speed; 
                npc[i].pos.dir = -1;
            }
            if ((npc[i].action == 2)||(npc[i].action == 6)||(npc[i].action == 7)) {
                npc[i].vel.x = npc[i].speed; 
                npc[i].pos.dir = 1;
            }
            if ((npc[i].action == 3)||(npc[i].action == 5)||(npc[i].action == 7)) {
                npc[i].vel.y = -npc[i].speed; 
            }
            if ((npc[i].action == 4)||(npc[i].action == 6)||(npc[i].action == 8))  {
                npc[i].vel.y = npc[i].speed; 
            }
            npc[i].disc.action = Math.round((Math.random()*1000)-992);
            npc[i].disc.action = Math.max(0,npc[i].disc.action);
            if (npc[i].disc.action) {
                if (npc[i].disc.state == 0) { // held
                    npc[i].disc.vel.x = 0;
                    npc[i].disc.vel.y = 0;
                    if (npc[i].disc.action == 1)
                        npc[i].disc.vel.x = -disc.speed;
                    else if (npc[i].disc.action == 2)
                        npc[i].disc.vel.x = disc.speed;
                    else if (npc[i].disc.action == 3)
                        npc[i].disc.vel.y = -disc.speed;
                    else if (npc[i].disc.action == 4)
                        npc[i].disc.vel.y = disc.speed;
                    else if (npc[i].disc.action == 5) {
                        npc[i].disc.vel.x = -npc[i].disc.speed * Math.sin(Math.PI/4);
                        npc[i].disc.vel.y = -npc[i].disc.speed * Math.sin(Math.PI/4);
                    }
                    else if (npc[i].disc.action == 6) {
                        npc[i].disc.vel.x = npc[i].disc.speed * Math.sin(Math.PI/4);
                        npc[i].disc.vel.y = npc[i].disc.speed * Math.sin(Math.PI/4);
                    }
                    else if (npc[i].disc.action == 7) {
                        npc[i].disc.vel.x = npc[i].disc.speed * Math.sin(Math.PI/4);
                        npc[i].disc.vel.y = -npc[i].disc.speed * Math.sin(Math.PI/4);
                    }
                    else if (npc[i].disc.action == 8) {
                        npc[i].disc.vel.x = -npc[i].disc.speed * Math.sin(Math.PI/4);
                        npc[i].disc.vel.y = npc[i].disc.speed * Math.sin(Math.PI/4);
                    }
                    npc[i].disc.state = 1;
                }
                else if (npc[i].disc.state == 1) { // thrown
                    npc[i].disc.state = 2;
                }
                npc[i].disc.action = 0;
            }
        } 
    } 
}


function animate() {

    var temp_distance;

   if (!game.state) {
       // animate disc
        if (disc.state == 0) {
            disc.pos.x = player.pos.x;
            disc.pos.y = player.pos.y;
        }
        else if (disc.state == 1) { // thrown
            disc.pos.x += disc.vel.x; 
            disc.pos.y += disc.vel.y; 
            if (disc.pos.x >= 1850) disc.state = 2;
            if (disc.pos.x <= 50) disc.state = 2;
            if (disc.pos.y <= 200) disc.state = 2;
            if (disc.pos.y >= screenHeight-50) disc.state = 2;
        }
        else if (disc.state == 2) { // returning
            disc.pos.x += 0.05 * (player.pos.x - disc.pos.x); // point: P equation is nice example of steady state error
            disc.pos.y += 0.05 * (player.pos.y - disc.pos.y); // issue: adjust to height player holds disc
            temp_distance = Math.sqrt((player.pos.x - disc.pos.x)*(player.pos.x - disc.pos.x)+(player.pos.y - disc.pos.y)*(player.pos.y - disc.pos.y)); 
            if (temp_distance < 50) disc.state = 0;
        }
 
    
        // enforce play area boundaries
        player.pos.x = Math.max(player.pos.x,120)
        player.pos.x = Math.min(player.pos.x,1800)
        player.pos.y = Math.min(player.pos.y,1200)
        player.pos.y = Math.max(player.pos.y,290)

        if ((player.action == 3) || (player.action == 4)) player.sprite_index = (((player.sprite_index-13)+1)%3) + 13;
        else if (!player.action) player.sprite_index = 8;
        else player.sprite_index = (player.sprite_index+1) % 8;

        for(i=0;i<npc.length;i++)  {

            npc[i].pos.x += npc[i].vel.x;
            npc[i].pos.y += npc[i].vel.y;

            // enforce play area boundaries
            npc[i].pos.x = Math.max(npc[i].pos.x,120)
            npc[i].pos.x = Math.min(npc[i].pos.x,1800)
            npc[i].pos.y = Math.min(npc[i].pos.y,1200)
            npc[i].pos.y = Math.max(npc[i].pos.y,290)

            if ((npc[i].action == 3) || (npc[i].action == 4)) npc[i].sprite_index = (((npc[i].sprite_index-13)+1)%3) + 13;
            else if (!npc[i].action) npc[i].sprite_index = 8;
            else npc[i].sprite_index = (npc[i].sprite_index+1) % 8;

            /*
            if (npc[i].action == 1) npc[i].sprite_index = (npc[i].sprite_index+1) % 8;
            else if (npc[i].action == 2) npc[i].sprite_index = (((npc[i].sprite_index-13)+1)%3) + 13;
            else npc[i].sprite_index = 8;
            */

            if (npc[i].disc.state == 0) {
                npc[i].disc.pos.x = npc[i].pos.x;
                npc[i].disc.pos.y = npc[i].pos.y;
            }
            else if (npc[i].disc.state == 1) { // thrown
                npc[i].disc.pos.x += npc[i].disc.vel.x; 
                npc[i].disc.pos.y += npc[i].disc.vel.y; 
                if (npc[i].disc.pos.x >= 1850) npc[i].disc.state = 2;
                if (npc[i].disc.pos.x <= 50) npc[i].disc.state = 2;
                if (npc[i].disc.pos.y <= 200) npc[i].disc.state = 2;
                if (npc[i].disc.pos.y >= screenHeight-50) npc[i].disc.state = 2;
            }
            else if (npc[i].disc.state == 2) { // returning
                npc[i].disc.pos.x += 0.05 * (npc[i].pos.x - npc[i].disc.pos.x); // point: P equation is nice example of steady state error
                npc[i].disc.pos.y += 0.05 * (npc[i].pos.y - npc[i].disc.pos.y); // issue: adjust to height player holds disc
                temp_distance = Math.sqrt((npc[i].pos.x - npc[i].disc.pos.x)*(npc[i].pos.x - npc[i].disc.pos.x)+(npc[i].pos.y - npc[i].disc.pos.y)*(npc[i].pos.y - npc[i].disc.pos.y)); 
                if (temp_distance < 50) npc[i].disc.state = 0;
            }
        }

        game.score = Math.round(5000*(currentTime()-startTime)); 
    } 

} 

function display() {

    // Some sample drawing 
    clearScreen();

    //draw title
    if (game.state < 0) { 
       drawImage(TITLE,0,0);
       return;
    }

    // draw background
    drawImage(BACKGROUND,0,0);

    // draw score
    fillText(game.score, 1220, 193, makeColor(1,1,1), "75px intellec", "center", "left");

    // draw player
    //drawImage(PLAYER_SPRITES,player.pos.x,player.pos.y, (26/32)*100, 100, player.sprites[player.sprite_index].x, player.sprites[player.sprite_index].y, 26, 32);
    drawTransformedImage(PLAYER_SPRITES,player.pos.x,player.pos.y, 0.0, player.pos.dir*player.height/32, player.height/32, player.sprites[player.sprite_index].x, player.sprites[player.sprite_index].y, 26, 32);
/*
    drawImage(PLAYER_SPRITES,50,screenHeight/2, 200, 200, 5, 2, 26, 32);
    drawImage(PLAYER_SPRITES,251,screenHeight/2, 200, 200, 33, 2, 26, 32);
    drawImage(PLAYER_SPRITES,452,screenHeight/2, 200, 200, 62, 2, 26, 32);
    drawImage(PLAYER_SPRITES,653,screenHeight/2, 200, 200, 89, 2, 26, 32);
    drawImage(PLAYER_SPRITES,854,screenHeight/2, 200, 200, 119, 2, 26, 32);
    drawImage(PLAYER_SPRITES,1055,screenHeight/2, 200, 200, 147, 2, 26, 32);
    drawImage(PLAYER_SPRITES,1256,screenHeight/2, 200, 200, 176, 2, 26, 32);
    drawImage(PLAYER_SPRITES,1457,screenHeight/2, 200, 200, 204, 2, 26, 32);

    drawImage(PLAYER_SPRITES,50,screenHeight/2+300, 200, 200, 5, 65, 26, 32);
    drawImage(PLAYER_SPRITES,251,screenHeight/2+300, 200, 200, 33, 65, 26, 32);
    drawImage(PLAYER_SPRITES,452,screenHeight/2+300, 200, 200, 62, 65, 26, 32);
    drawImage(PLAYER_SPRITES,653,screenHeight/2+300, 200, 200, 89, 65, 26, 32);
    drawImage(PLAYER_SPRITES,854,screenHeight/2+300, 200, 200, 119, 65, 26, 32);
    drawImage(PLAYER_SPRITES,1055,screenHeight/2+300, 200, 200, 147, 65, 26, 32);
    drawImage(PLAYER_SPRITES,1256,screenHeight/2+300, 200, 200, 176, 65, 26, 32);
    drawImage(PLAYER_SPRITES,1457,screenHeight/2+300, 200, 200, 204, 65, 26, 32);
*/

    if (!disc.state) {
        if (player.pos.dir > 0 ) 
            fillRectangle(player.pos.x+((26/32)*player.height*0.1),player.pos.y-(player.height*0.2), 20, 20, makeColor(1.0,1.0,0.0));
        else 
            fillRectangle(player.pos.x+player.pos.dir*((26/32)*player.height*0.35),player.pos.y-(player.height*0.2), 20, 20, makeColor(1.0,1.0,0.0));
    }
    else if (disc.state == 2) fillRectangle(disc.pos.x,disc.pos.y, 20, 20, makeColor(1.0,1.0,0.0));
    else if (disc.state == 1) fillRectangle(disc.pos.x,disc.pos.y, 20, 5, makeColor(1.0,1.0,0.0));

    // draw npcs
    for(i=0;i<npc.length;i++)  {
        drawTransformedImage(NPC_SPRITES,npc[i].pos.x,npc[i].pos.y, 0.0, npc[i].pos.dir*npc[i].height/32, npc[i].height/32, player.sprites[npc[i].sprite_index].x, player.sprites[npc[i].sprite_index].y, 26, 32);
        if (!npc[i].disc.state) {
            if (npc[i].pos.dir > 0 ) 
                fillRectangle(npc[i].pos.x+((26/32)*npc[i].height*0.1),npc[i].pos.y-(npc[i].height*0.2), 20, 20, makeColor(0.0,0.0,1.0));
            else 
                fillRectangle(npc[i].pos.x+npc[i].pos.dir*((26/32)*npc[i].height*0.35),npc[i].pos.y-(npc[i].height*0.2), 20, 20, makeColor(0.0,0.0,1.0));
        }
        else if (npc[i].disc.state == 2) fillRectangle(npc[i].disc.pos.x,npc[i].disc.pos.y, 20, 20, makeColor(0.0,0.0,1.0));
        else if (npc[i].disc.state == 1) fillRectangle(npc[i].disc.pos.x,npc[i].disc.pos.y, 20, 5, makeColor(0.0,0.0,1.0));
    }


}

///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //
