///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //

// TODO: DECLARE and INTIALIZE your constants here
var START_TIME = currentTime();
var TITLE = loadImage("cdd_title.png");
var BACKGROUND = loadImage("cdd_background.png");
var PLAYER_SPRITES = loadImage("cron_spritesheet_mattel.png");


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

    animate();
    display(); 


}

function animate() {

    var temp_distance;

    if (game.state < 0) {
        if ((player.key.left.pressed)||(player.key.right.pressed)) game.state = 0;
    }
    else if (!game.state) {
        // user controls
        player.action = 0;
        if (player.key.left.pressed) {
            player.pos.x -= player.speed; 
            player.pos.dir = -1;
            player.action = 1;
        }
        if (player.key.right.pressed) {
            player.pos.x += player.speed; 
            player.pos.dir = 1;
            player.action = 1;
        }
        if (player.key.up.pressed) {
            player.pos.y -= player.speed; 
            player.action = 2;
        }
        if (player.key.down.pressed) {
            player.pos.y += player.speed; 
            player.action = 2;
        }
        if (disc.action) {
        // issue : add flag to allow disc to be released when key is released
            if (disc.state == 0) { // held
                disc.pos.x = player.pos.x;
                disc.pos.y = player.pos.y;
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
            //player.action = 2;
            disc.action = 0;
        }

        // animate disc
        if (disc.state == 1) { // thrown
            disc.pos.x += disc.vel.x; 
            disc.pos.y += disc.vel.y; 
            if (disc.pos.x >= 1760) disc.state = 2;
            if (disc.pos.x <= 90) disc.state = 2;
            if (disc.pos.y <= 240) disc.state = 2;
            if (disc.pos.y >= 1150) disc.state = 2;
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

        if (player.action == 1) player.sprite_index = (player.sprite_index+1) % 8;
        else if (player.action == 2) player.sprite_index = (((player.sprite_index-13)+1)%3) + 13;
        else player.sprite_index = 8;

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
    if (player.pos.dir > 0 ) 
        fillRectangle(player.pos.x+((26/32)*player.height*0.1),player.pos.y-(player.height*0.2), 20, 20, makeColor(1.0,1.0,0.0));
    else 
        fillRectangle(player.pos.x+player.pos.dir*((26/32)*player.height*0.35),player.pos.y-(player.height*0.2), 20, 20, makeColor(1.0,1.0,0.0));
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
    if (disc.state == 2) fillRectangle(disc.pos.x,disc.pos.y, 20, 20, makeColor(1.0,1.0,0.0));
    else if (disc.state == 1) fillRectangle(disc.pos.x,disc.pos.y, 20, 5, makeColor(1.0,1.0,0.0));


}

///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //
