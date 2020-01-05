let snakes = [];
let old_gen = [];
var foods = [];
const NUMBER_OF_SNAKES = 3000;
const NUMBER_OF_FOODS = 200;
const LEARNING_RATE = 0.05;
const MUTATE_RATE= 0.2;
const GRID_SIZE = 5;
const INITIAL_HEALTH = 100;
const FOOD_HEALTH = 80;
const speed = 30; // Should be divide 60
const CANVAS_SIZE = 600;
var bestSnake;
var showSnakes = true;
var showPipes = true;
var score;
var highScore;
var generation = 0;
var gameSpeed = 1;
var isTraining = false;
function setup() {
  score = 0;
  highScore = 0;
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  for (let i =0; i< NUMBER_OF_SNAKES; i++){
    snakes.push(new Snake());
  }
  for (let i = 0; i < NUMBER_OF_FOODS; i++) {
     foods.push(new Food());
  }
  // pipes.push(new Pipe());
  playBestButton = createButton('Play the best snake so far');
  playBestButton.position(5, CANVAS_SIZE+5);
  playBestButton.mousePressed(()=> {playSnake(bestSnake)});
  showSnakesButton =  createButton("Show Snakes");
  showPipesButton = createButton("Show Pipes");
  showSnakesButton.position(5, CANVAS_SIZE+30);
  showPipesButton.position(5, CANVAS_SIZE+50);
  showSnakesButton.mousePressed(()=> {showSnakes = !showSnakes});
  showPipesButton.mousePressed(()=> {showPipes = !showPipes});
  speedSlider = createSlider(1, 100, 1);
  speedSlider.position(100, CANVAS_SIZE+80);
  trainButton = createButton("Train");
  trainButton.position(5, CANVAS_SIZE+80);
  trainButton.mousePressed(()=> {isTraining = !isTraining; train()});
  saveCurrentSnakeButton = createButton("Save the current snake");
  saveCurrentSnakeButton.position(5, CANVAS_SIZE+120);
  saveCurrentSnakeButton.mousePressed(() => {
    saveSnake(snakes[0]);
  });
  saveBestSnakeButton = createButton("Save the best snake");
  saveBestSnakeButton.position(140, CANVAS_SIZE+120);
  saveBestSnakeButton.mousePressed(() => {
    saveSnake(bestSnake);
  });
  input = createFileInput(handleFile);
  input.position(300, CANVAS_SIZE + 120);
}

function gameLoop(){
  calculateFitness();
  score+=1;
  gameSpeed = speedSlider.value();
  if (score > highScore) {
    bestSnake = snakes[0]; // ?
  }
  for (snake of snakes) {
    snake.health -= 1;
    if (snake.isOffScreen() || snake.health < 1) {
      old_gen.push(snakes.splice(snakes.indexOf(snake), 1)[0]);
    }
    if (snakes.length == 0) {
      restart();
      return;
    }
  }
  for (food of foods) {
    for (snake of snakes) {
      if (food.hits(snake)) {
        snake.size += 1;
        snake.food += FOOD_HEALTH;
        foods.splice(foods.indexOf(food), 1);
        foods.push(new Food());
      }
    }
  }
  for (snake of snakes) {
    snake.score+=1;
    snake.think(foods);
    snake.update();
    // }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function train(){
  while(isTraining){
    for(let i =0 ; i<gameSpeed; i++){
      gameLoop();
    }
    await sleep(1);
  }
}

function draw() {
  if(frameCount%(60/speed) == 0) {
  background(0);
  if(!isTraining){
                   calculateFitness();
                   //gameSpeed = speedSlider.value();
                   score += 1;
                   if (score > highScore) {
                     bestSnake = snakes[0]; // ?
                   }
                   for (snake of snakes) {
                     snake.health -= 1;
                     if (snake.isOffScreen() || snake.health < 1) {
                       old_gen.push(snakes.splice(snakes.indexOf(snake), 1)[0]);
                     }
                     if (snakes.length == 0) {
                      
                       restart();
                       return;
                     }
                   }
                   for (food of foods) {
                     if (showPipes) {
                       food.show();
                     }
                     for (snake of snakes) {
                       if (food.hits(snake)) {
                         snake.size += 1;
                         snake.health += FOOD_HEALTH;
                         foods.splice(foods.indexOf(food), 1);
                         foods.push(new Food());
                       }
                     }
                   }
                   for (snake of snakes) {
                    snake.score+=1;
                     snake.think(foods);
                     snake.update();
                     if(showSnakes){
                     snake.show();
                     }
                     // }
                   }
                 }
   
  let s = `Score  : ${score}\nHighScore : ${highScore}\nGeneration : ${generation}`;
  //fill(255);
  text(s, 10, 10, 100, 80);
  let speedText = `Speed  : x${gameSpeed}`;
  text(speedText, CANVAS_SIZE-80, CANVAS_SIZE-30, 100, 80);
}
}
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    // console.log("Space pressed;")
    snakes[0].changeDirection("n");
  }
  else if(keyCode === RIGHT_ARROW){
    snakes[0].changeDirection("c");
  }
}

function restart() {
  snakes = [];
  foods = [];
  nextGeneration();
  generation+=1;
  if(score> highScore) {
    highScore = score;
  }
  
  score = 0;

}

function playSnake(snake){
  for(snake of snakes) {
    old_gen.push(snake);
  }
  snakes = [snake];
}

function handleFile(file){
  //console.log(file);
  var snake = JSON.parse(atob(file.data.split(",")[1]));
  var newSnake = new Snake();
  newSnake.replaceBrain(snake.brain);
  snakes = [newSnake];
}




function saveSnake(snake){
  // var data = JSON.stringify(snake);
  // var filename="snake.json";
  // var type = "json";
  //  var file = new Blob([data], { type: type });
  //  if (window.navigator.msSaveOrOpenBlob)
  //    // IE10+
  //    window.navigator.msSaveOrOpenBlob(file, filename);
  //  else {
  //    // Others
  //    var a = document.createElement("a"),
  //      url = URL.createObjectURL(file);
  //    a.href = url;
  //    a.download = filename;
  //    document.body.appendChild(a);
  //    a.click();
  //    setTimeout(function() {
  //      document.body.removeChild(a);
  //      window.URL.revokeObjectURL(url);
  //    }, 0);
  //  }
  saveJSON(snake,"snake.json");
}
