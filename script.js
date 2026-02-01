const board=document.querySelector('.board');
const startButton=document.querySelector('.btn-start');
const restartBtn=document.querySelector('.btn-restart');
const modal=document.querySelector('.modal');
const startGameModal=document.querySelector('.start-game');
const GameOverModal=document.querySelector('.game-over');

const highScoreElement=document.querySelector('#high-score');
const scoreElement=document.querySelector('#score');
const timeElement=document.querySelector('#time');

const blockHeight=50;
const blockWidth=50;

let highScore=localStorage.getItem("highScore") || 0;
let score=0;
let time='00-00';

highScoreElement.innerText=highScore;

const cols=Math.floor(board.clientWidth/blockWidth);
const rows=Math.floor(board.clientHeight/blockHeight);

let intervalId=null;
let timerIntervalId=null;

let food={
    x:Math.floor(Math.random()*rows),
    y: Math.floor(Math.random()*cols)
};

let direction='down';

// for(let i=0;i<rows*cols;i++){
//     const block=document.createElement('div');
//     block.classList.add('block');
//     board.appendChild(block);
// }
const blocks=[];
let snake=[{
    x:1,y:3
}
];

for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){

    const block=document.createElement('div');
    block.classList.add('block');
    board.appendChild(block);
    // block.innerText=`${row}-${col}`;
   blocks[`${row}-${col}`]=block;
   }
}

blocks[`${food.x}-${food.y}`].classList.add('food');

function render(){
    
    let head={...snake[0]};

  if (direction === 'left') head.y--;
    else if (direction === 'right') head.y++;
    else if (direction === 'up') head.x--;
    else if (direction === 'down') head.x++;
 
    if(head.x<0 || head.x >=rows || head.y<0 || head.y >=cols){
       
  return endGame();
    }


    snake.forEach(block=>{
        blocks[`${block.x}-${block.y}`].classList.remove("fill");
    } );

    //food check
    if(head.x==food.x && head.y==food.y){
         blocks[`${food.x}-${food.y}`].classList.remove('food');
         food={
            x:Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        }

         snake.unshift(head);
         blocks[`${food.x}-${food.y}`].classList.add('food');

         score+=10;
         scoreElement.innerText=score;

         if(score>highScore){
            highScore=score;
            localStorage.setItem("highScore",highScore.toString());
            
         }
    }else{
        snake.unshift(head); // Add new head
        snake.pop();
    }

    

    snake.forEach(block=>{
        blocks[`${block.x}-${block.y}`].classList.add("fill");
    });
}


    function endGame(){
        clearInterval(intervalId);

        modal.style.display='flex';

       startGameModal.style.display="none";
        GameOverModal.style.display="flex";
    }


startButton.addEventListener("click",()=>{
    modal.style.display='none';
      intervalId=setInterval(()=>{ render() },300);
      timerIntervalId=setInterval(()=>{
        let [min,sec]=time.split("-").map(Number)
        if(sec==59){
            min+=1;
            sec=0;
        }else sec+=1;

        time=`${min}-${sec}`;
        timeElement.innerText=time;
      },1000);

});

function restartGame(){
    clearInterval(intervalId);

snake.forEach(block => 
    blocks[`${block.x}-${block.y}`].classList.remove("fill")
);

    blocks[`${food.x}-${food.y}`].classList.remove('food');
    
    snake = [{ x: 1, y: 3 }];
    direction = 'down';
    food = { x: Math.floor(Math.random() * rows),
         y: Math.floor(Math.random() * cols) 
        };

        blocks[`${food.x}-${food.y}`].classList.add('food');

        score=0;
    time='00-00';

    scoreElement.innerText=score;
    timeElement.innerText=time;
    highScoreElement.innerText=highScore;

  modal.style.display = 'none';
    GameOverModal.style.display = 'none'; // Hide this for the next round
    startGameModal.style.display = 'flex'; // Reset this for the next round

    intervalId =setInterval(()=>{ render() },300);
}  

restartBtn.addEventListener("click", restartGame);




addEventListener("keydown",(event)=>{
    if(event.key==='ArrowUp'){
        direction='up';
    }else if(event.key==='ArrowDown'){
        direction='down';
    }else if(event.key==='ArrowLeft'){
        direction='left';
    }else if(event.key ==='ArrowRight'){
        direction='right';
    }
});
