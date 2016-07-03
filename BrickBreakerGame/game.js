//draws the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


//variables 
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 7;
var dy = -4;
var paddleHeight = 12;
var paddleWidth = 100;
var paddleX = (canvas.width-paddleWidth)/2;
var rightKey = false;
var leftKey = false;
var brickRows = 12;
var brickColumns = 7;
var brickWidth = 98;
var brickHeight = 20;
var brickPadding = 13;
var brickOffsetTop = 35;
var brickOffsetLeft = 15;
var score = 0;
var lives = 3;
var music;
var mus= new Audio ("soundEffect.mp3");
var  brickColors = ["#e60000", "#ff0000", "#ff3300", "#ff6600", "#ff6600", " #ff9933", " #ffcc00", " #ffcc00", "#ffff00", "#ccff33", "#99cc00", "green"];

//adds sound - plays 'mySong' in the background
music = new sound("mySong.mp3");
music.play();
// sound function to play the background music
function sound(src) {
   this.sound = document.createElement("audio");
   this.sound.src = src;
   this.sound.setAttribute("preload", "auto");
   this.sound.setAttribute("controls", "none");
   this.sound.style.display = "none";
   document.body.appendChild(this.sound);
   this.play = function(){
       this.sound.play();
   }
}
//Making the bricks disappear after they are hit
var bricks = [];
for(c=0; c<brickColumns; c++) {
    bricks[c] = [];
    for(r=0; r<brickRows; r++) {
		//the status of the brick will determine if it should still be drawn on the screen or not (if it was hit vs. not hit by the ball)
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
//Event listner for when specific keys are pressed
//Default value for both events is false because when the window loads, the control buttons are not pressed
//When a button is pressed, the keyPressed function is executed
document.addEventListener("keydown", keyPressed, false);
//When a button is pressed, the keyNotPressed function is executed and the same goes for the mouse movement
document.addEventListener("keyup", keyNotPressed, false);
document.addEventListener("mousemove", mouseMoved, false);

//functions decribing what happens when key is pressed
//if the left or the right cursor keys are pressed, variables correspinding to each are set true
function keyPressed(e) {
	//right key
    if(e.keyCode == 39) {
        rightKey = true;
    }
	//left key
    else if(e.keyCode == 37) {
        leftKey = true;
    }
}

//functions decribing what happens when key is Not pressed
//if the left or the right cursor keys are Not pressed, variables correspinding to each are set false
function keyNotPressed(e) {
    if(e.keyCode == 39) {
        rightKey = false;
    }
    else if(e.keyCode == 37) {
        leftKey = false;
    }
}

//function decribing what happens when mouse is moved
function mouseMoved(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

//function for what happens when ball hits bricks
//this function will loop through all the bricks and compare the position of each brick with the ball's coordinates as each frame is drawn
function collide() {
    for(c=0; c<brickColumns; c++) {
        for(r=0; r<brickRows; r++) {
            var b = bricks[c][r];
			//if status is 1, then draw the brick, if it's 0, then do not draw it as it was hit by the ball
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
					//increases score by one when a brick is hit
                    score++;
					//plays the music file defined above in variable as mus when each brick is hit
					mus.play();
					//when all the bricks are hit, alert pops up indicating game is won 
                    if(score == brickRows*brickColumns) {
                        alert("YOU BEAT IT!");
						//game reloads to play again
                        document.location.reload();
                    }
                }
            }
        }
    }
}

//functions for drawing the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

//functions for drawing the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

//functions for drawing the bricks
function drawBricks() {
    for(c=0; c<brickColumns; c++) {
        for(r=0; r<brickRows; r++) {
            if(bricks[c][r].status == 1) {
				//Each brickX position is calculated as brickWidth + brickPadding, multiplied by the coloumn number, r/row number, c, plus the brickOffsetTop/Left;
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColors[r];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//functions for displaying the score
function drawScore() {
    ctx.font = "20px Tahoma";
    ctx.fillStyle = "orange";
    ctx.fillText("Score: "+score, 13, 20);
}

//functions for displaying the lives
function drawLives() {
    ctx.font = "20px Tahoma";
    ctx.fillStyle = "orange";
    ctx.fillText("Lives: "+lives, canvas.width-80, 20);
}

function draw() {
	//clears the canvas before each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	//draws
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
	//for when colliding 
    collide();
    
	//for bouncing off the walls -  when the distance b/w the center of the ball and the edge of the wall is exactly equal to the radius of the ball, the ball will change its direction
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
	//reverses the direction of the ball when boundry is reached
        dx = -dx;
    }
	//reverses the direction of the ball when boundry is reached
    if(y + dy < ballRadius) {
        dy = -dy;
    }
	//hitting the bottom wall will end the game unless its on the paddle. If its b/w the edges of the paddle, it will reverse its direction
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
		//having no lives left will end the game
        else {
            lives--;
            if(!lives) {
				
               alert("Oops you ran out of lives! Try again!");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 8;
                dy = -5;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    //If the left cursor is pressed, the paddle will move 10 pixels to the left, and if the right cursor is pressed, the paddle will move 10 pixels to the right.
    if(rightKey && paddleX < canvas.width-paddleWidth) {
        paddleX += 10;
    }
    else if(leftKey && paddleX > 0) {
        paddleX -= 10;
    }
    
	//requestAnimationFrame helps the browser render the game better than the fixed framerate in the setInterval(). 
	requestAnimationFrame(draw);
    x += dx;
    y += dy;
    
}

draw();
