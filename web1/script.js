// Установка Canvas
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

//Управление мышью
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(e){
    mouse.click = true;
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function(e){
    mouse.click = false;
});

//Игрок
const playerLeft = new Image();
playerLeft.src = 'img/catLeft.png';
const playerRight = new Image();
playerRight.src = 'img/catRight.png';

class Player {
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 40;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 59;
        this.spriteHeight = 40;
        this.speed = 0;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        console.log(dy);
        if(10 > Math.abs(dx) && 10 > Math.abs(dy)){
            this.speed = 0;
        } else {
            this.speed = 1;
        }
        let theta = Math.atan2(dy,dx);
        this.angle = theta;
        if (mouse.x != this.x) {
            this.x -= dx/20;
        }
        if(mouse.y != this.y) {
            this.y -= dy/30;
        }
    }
    draw(){
        if(mouse.click){
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        if (gameFrame % 10 == 0) {
            if(this.speed == 0) {
                this.frameX = 2;
            } else {
                if ( this.frameX == 3) {
                    this.frameX = 0;
                } else this.frameX++;
            }
            
        }

        /*ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0 , Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);*/
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, 
                this.frameY * this.spriteHeight, this.spriteWidth, 
                this.spriteHeight, 0 - 55, 0 - 45, this.spriteWidth * 2, 
                this.spriteHeight * 2);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, 
                this.frameY * this.spriteHeight, this.spriteWidth, 
                this.spriteHeight, 0 - 55, 0 - 35, this.spriteWidth * 2, 
                this.spriteHeight * 2);
        }
        ctx.restore();
    }
}
const player = new Player();

//Мышь
const bubblesArray = [];
const rat = new Image();
rat.src = 'img/ratTop.png';
class Bubble {
    constructor() {
        this.type = Math.floor(Math.random() * 3) + 1;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 10 * this.type;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.spriteWidth = 32;
        this.spriteHeight = 32;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        if(this.type == 1) {
            this.points = 30;
        } else if(this.type == 2) {
            this.points = 20;
        } else {
            this.points = 10;
        }
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
        
    }
    draw(){
        if (gameFrame % 10 == 0) {
            this.frame++;
            if (this.frame >= 3) this.frame = 0;
            if ( this.frame == 2) {
                this.frameX = 0;
            } else this.frameX++;
        }
        /*ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();*/
        if(this.type == 1) {
            ctx.drawImage(rat, this.frameX * this.spriteWidth, 
                this.frameY * this.spriteHeight, this.spriteWidth, 
                this.spriteHeight, this.x - 16, this.y - 21, this.spriteWidth, 
                this.spriteHeight);
        } else if(this.type == 2) {
            ctx.drawImage(rat, this.frameX * this.spriteWidth, 
                this.frameY * this.spriteHeight, this.spriteWidth, 
                this.spriteHeight, this.x - 27, this.y - 34, this.spriteWidth * 1.7, 
                this.spriteHeight * 1.7);
        } else {
            ctx.drawImage(rat, this.frameX * this.spriteWidth, 
                this.frameY * this.spriteHeight, this.spriteWidth, 
                this.spriteHeight, this.x - 37, this.y - 43, this.spriteWidth * 2.4, 
                this.spriteHeight * 2.4);
        }
    }
}

const bubblePop = document.createElement('audio');
bubblePop.src = 'sound/score.wav';
bubblePop.volume -= 0.9;

function handleBubbles(){
    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].draw();
        bubblesArray[i].update();

        if(bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i, 1);
            i--;
        } else if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
            if(!bubblesArray[i].counted){
                bubblePop.play();
                score += bubblesArray[i].points;
                bubblesArray[i].counted = true;
                bubblesArray.splice(i, 1);
                i--;
            }
        }
    }
    if(gameFrame % 50 == 0){
        bubblesArray.push(new Bubble());
    }
}

//Повторяющийся задний фон
const background = new Image();
background.src = 'img/brick/1.png';

function handleBackground() {
    for(let i = 0; canvas.width > i; i += 128){
        for(let j = 0; canvas.width > j; j += 128){
            ctx.drawImage(background, i, j, 128, 128);
        }
        
    }
}


//Анимация
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
});
