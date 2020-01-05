function nextGeneration() {
    calculateFitness();

    for (let i = 0; i< NUMBER_OF_SNAKES; i ++) {
        snakes.push(pickOne());
    }
    for (let i = 0; i < NUMBER_OF_FOODS; i++) {
      foods.push(new Food());
    }
    old_gen = [];
}

function pickOne() {
    var index = 0;
    var r = random(1);
    while(r > 0) {
        r = r - old_gen[index].fitness;
        index++;
    }
    index--;
    let snake = old_gen[index];
    child = new Snake(snake.brain);
    child.mutate(MUTATE_RATE);
    return child;
}

function calculateFitness() {
    let sum = 0;
    for(snake of old_gen) {
        sum += snake.score;
    }
    for(snake of old_gen) {
        snake.fitness += snake.score/sum;
    }
}