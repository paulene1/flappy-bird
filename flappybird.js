// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    height : birdHeight,
    width : birdWidth
}

// pipes
let pipeArr = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let botPipeImg;

// physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4; //positive #, bird will go DOWN

//game over
let gameOver = false;

//score
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d") //used for drawing on the board

    //load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png"

    botPipeImg = new Image();
    botPipeImg.src = "./bottompipe.png"

    requestAnimationFrame(update);
    setInterval(placePipes, 1500)
    //when key is pressed down
    document.addEventListener("keydown", moveBird);


}
//UPDATE FUNCTION
function update(){
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // BIRD UPDATE
    velocityY += gravity;

    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);//applies gravity to current bird.y, limit the bird.y to top of canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height){
        gameOver = true;
    }
    // DRAWING THE PIPES
    for (let i=0; i < pipeArr.length; i++){
        let pipe = pipeArr[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        //updating score
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5  //0.5 bc there are two pipes, score increases .5 for each pipe passed (2)
            pipe.passed = true;
        }

        //if bird runs into pipes
        if (detectCollision(bird, pipe)){
            gameOver = true;
        }

    }
    //clear pipes
    while (pipeArr.length > 0 && pipeArr[0].x < -pipeWidth){
        pipeArr.shift();
    }
    //SCORE
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45,);

    if (gameOver){
        context.fillText("GAME OVER", 43, 90);
    }
}

// PLACING PIPES DOWN
const placePipes = () => {
    if (gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX, 
        y : randomPipeY, 
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArr.push(topPipe);

    let botPipe = {
        img : botPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight, 
        passed : false
    }
    pipeArr.push(botPipe)
}

//MOVING BIRD
const moveBird = e => {//e is key event
    if (e.code == "Space" || e.code == "ArrowUp"){
        //jump
        velocityY = -6;

        //resetting game
        if(gameOver){
            bird.y = birdY;
            pipeArr = [];
            score = 0
            gameOver = false;
        }
    }
}

const detectCollision = (a, b) => {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
}