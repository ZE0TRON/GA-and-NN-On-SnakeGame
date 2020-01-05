function Snake(brain) {
  this.y =
    Math.floor(random(Math.floor(height / GRID_SIZE) - 2)) * GRID_SIZE +
    GRID_SIZE;
  this.x =
    Math.floor(random(Math.floor(width / GRID_SIZE) - 2)) * GRID_SIZE +
    GRID_SIZE;
  this.size = 1;
  this.score = 0;
  this.color = [
    Math.floor(random(255)),
    Math.floor(random(255)),
    Math.floor(random(255))
  ];
  this.fitness = 0;
  this.velocity = 0;
  this.direction=['u','d','l','r'][Math.floor(random(4))];
  this.health = INITIAL_HEALTH;
  if (brain) {
    this.brain = brain.copy();
  } else {
           // Inputs :
           // Own  head width -x
           // Own  head height -y
           // Food width -x
           // Food height -y
           // Own direction
           // Own health ?

           // Output:
           // Clockwise
           // Non Clockwise
           // No rotate
           this.brain = new NeuralNetwork(4,8,3);
           this.brain.setLearningRate(LEARNING_RATE);
         }
  this.show = function() {
    fill(this.color);
    if(this.direction==="u" || this.direction==="d") {
        rect(this.x, this.y, GRID_SIZE, GRID_SIZE*this.size);
    }
    else {
        rect(this.x, this.y, GRID_SIZE * this.size,GRID_SIZE);
    }
  };
  this.replaceBrain = function(brainData) {
    this.brain.weights_ih.data = brainData.weights_ih.data;
    this.brain.weights_ho.data = brainData.weights_ho.data;
    this.brain.bias_h.data = brainData.bias_h.data;
    this.brain.bias_o.data = brainData.bias_o.data;
  };
  this.getClosestFood = function(foods,head) {
      let distance = Infinity;
      var closestFood ;
    for(food of foods) {
        let xDiff =this.takeMod(food.x-head.x,width) ;
        let yDiff = this.takeMod(food.y-head.y,height);
        let calcDistance = Math.sqrt((xDiff*xDiff) + (yDiff*yDiff));
        if( calcDistance < distance) {
            distance = calcDistance;
            closestFood = food;
        }
    }
    return closestFood;
  }
  this.think = function(foods) {
    head = this.getHeadLocation();
    closestFood = this.getClosestFood(foods,head);
    let inputs = [];
    // inputs[0] = (width - head.x) / width;
    // inputs[1] = (height - head.y) / height;
    inputs[0] = (head.x - closestFood.x) / GRID_SIZE;
    inputs[1] = (head.y - closestFood.y) / GRID_SIZE;
    var paramDir;
    https: switch (this.direction) {
      case "u":
        paramDir = GRID_SIZE;
        break;
      case "d":
        paramDir = GRID_SIZE * 3;
        break;
      case "l":
        paramDir = GRID_SIZE * 2;
        break;
      case "r":
        paramDir = GRID_SIZE * 4;
        break;
    }
    inputs[2] = paramDir;
    inputs[3] = this.size;
    let output = this.brain.predict(inputs);
    let action = output.indexOf(Math.max(...output));
    if(output[2]<0.5){
      if (action == 0) {
        this.changeDirection("c");
      } else if (action == 1) {
        this.changeDirection("n");
      }
    }
    
  };

  // c = clockwise n = non-clockwise
  this.changeDirection = function(rotate) {
      head = this.getHeadLocation();
      this.x = head.x;
      this.y = head.y;
    switch (this.direction) {
      case "u":
        this.direction = rotate === "c" ? "r":"l";
        break;
      case "d":
        this.direction = rotate === "c" ? "l" : "r";
        break;
      case "l":
        this.direction = rotate === "c" ? "u" : "d";
        break;
      case "r":
          this.direction = rotate === "c" ? "d" : "u";
        break;
    }
     
  }
  this.update = function() {
    switch (this.direction) {
      case "u":
          this.y-=GRID_SIZE;
        break;
      case "d":
          this.y += GRID_SIZE;
        break;
      case "l":
        this.x -= GRID_SIZE;
        break;
      case "r":
          this.x+=GRID_SIZE;
        break;
    default:
        console.log("There is an error");
    }
  };

  this.mutate = function() {
    this.brain.mutate(0.2);
  };

  this.getHeadLocation = function(){
    var newY,newX;
    switch (this.direction) {
      case "u":
        newY = this.y - (this.size-1)*GRID_SIZE;
        newX = this.x;
        break;
      case "d":
        newY = this.y + (this.size - 1) * GRID_SIZE;
        newX = this.x;
        break;
      case "l":
        newX = this.x - (this.size - 1) * GRID_SIZE;
        newY = this.y;
        break;
      case "r":
        newX = this.x + (this.size - 1) * GRID_SIZE;
        newY = this.y;
        break;
      default:
        console.log("There is an error");
    }
    return {x:newX,y:newY};
  }
  this.isOffScreen = function() {
    head = this.getHeadLocation();
    newX= head.x;
    newY= head.y;
    if(!((newY <= height) && (newY >= 0 ) && (newX <= width) && (newX >= 0))) {
        this.x = this.takeMod(this.x/GRID_SIZE,width/GRID_SIZE)*GRID_SIZE;
        this.y = this.takeMod(this.y/GRID_SIZE,height/GRID_SIZE)*GRID_SIZE;
    }
  }
  this.takeMod = function(n,m) {
        return ((n % m) + m) % m;
  }
}
