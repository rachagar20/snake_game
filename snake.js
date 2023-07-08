//Game Constants
let directions={
    x:0,
    y:0
};
let score=0;
let highScore=0;
let velocity={x:0,y:0};
let foodSound=new Audio("food.mp3");
let moveSound=new Audio("move.mp3");
let gameOver=new Audio("gameover.mp3");
let gameMusic=new Audio("music.mp3");
let lastPaintTime=0;
let speed=10;
let board=document.querySelector("#board");
let snakeArr=[{x:13,y:15}];
let food={x:6,y:7};
let scoreBox=document.querySelector("#scoreDis");
let highscoreBox=document.querySelector("#highscoreDis");
const selectSpeed=document.querySelector("#speeds");
const soundButton=document.querySelector("#soundBox");
//Game functions
function main(ctime){
    requestAnimationFrame(main);
    if((ctime-lastPaintTime)/1000<1/speed){
        return;
    }
    lastPaintTime=ctime;
    gameEngine();
}
function isCollided(){
    for(let i=1;i<snakeArr.length;i++){
        if(snakeArr[0].x===snakeArr[i].x&&snakeArr[0].y===snakeArr[i].y){
            return true;
        }
    }

    if(snakeArr[0].x<=0||snakeArr[0].y<=0||snakeArr[0].x>=18||snakeArr[0].y>=18){
        return true;
    }

    return false;
}
function gameEngine(){
    //update snake
    if(isCollided()){
        gameOver.play();
        gameMusic.pause();
        velocity={x:0,y:0};
        alert("Game Over.Press OK to start again");
        snakeArr=[{x:13,y:15}];
        score=0;
        scoreBox.innerHTML="Score: "+score;
    }
    //when snake eats the apple
    if(snakeArr[0].x===food.x&&snakeArr[0].y===food.y){
        foodSound.play();
        score+=1;
        scoreBox.innerHTML="Score: "+score;
        if(score>highScore){
            highScore=score;
            localStorage.setItem("high",JSON.stringify(highScore));
            highscoreBox.innerHTML="HighScore: "+highScore;
        }
        snakeArr.unshift({x:snakeArr[0].x+velocity.x,y:snakeArr[0].y+velocity.y});
        food={
            x:Math.floor(Math.random()*16)+1,
            y:Math.floor(Math.random()*16)+1
        };
    }

    //moving the snake
    for(let i=snakeArr.length-2;i>=0;i--){
        snakeArr[i+1]={...snakeArr[i]};
    }
    snakeArr[0].x+=velocity.x;
    snakeArr[0].y+=velocity.y;
     //display the snake
    board.innerHTML="";
    snakeArr.forEach((e,index)=>{
        let snakeElement=document.createElement("div");
        snakeElement.style.gridRowStart=e.y;
        snakeElement.style.gridColumnStart=e.x;
        if(index===0){
            snakeElement.classList.add("head"); 
        }else{
            snakeElement.classList.add("snake");
        }
        board.appendChild(snakeElement);
    });

    //display the food
    let foodElement=document.createElement("div");
    foodElement.style.gridRowStart=food.y;
    foodElement.style.gridColumnStart=food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}
selectSpeed.addEventListener("change",function(){
    speed=this.value;
})

soundButton.addEventListener("click",function(){
    if(soundButton.innerHTML==="Music: ON"){
        gameMusic.pause();
        soundButton.innerHTML="Music: OFF";
    }else{
        gameMusic.play();
        soundButton.innerHTML="Music: ON";
    }
})
let high=localStorage.getItem("high");
if(high==null){
    highScore=0;
    localStorage.setItem("high",JSON.stringify(highScore));
}
else{
    highScore=JSON.parse(high);
    highscoreBox.innerHTML="HighScore: "+highScore;
   
}
//Main logic that is to be implemented
window.requestAnimationFrame(main); //to paint the screen again and again
//to recogonize the keys being pressed
window.addEventListener("keydown",e=>{
    velocity={x:0,y:1};
    moveSound.play();
    switch(e.key){
        case "ArrowUp":
            velocity.x=0;
            velocity.y=-1;
            break;
        case "ArrowDown":
            velocity.x=0;
            velocity.y=1;
            break;
        case "ArrowLeft":
            velocity.x=-1;
            velocity.y=0;
            break;                
        case "ArrowRight":
            velocity.x=1;
            velocity.y=0;
            break;
        default:
            break;
    }
});