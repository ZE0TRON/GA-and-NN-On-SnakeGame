function Bird(brain) {
    this.y = height/2;
    this.x = 25;
    this.gravity = 1;
    this.score = 0;
    this.fitness = 0;
    this.velocity = 0;
    this.radius = 16;
    if(brain){
        this.brain = brain.copy();
    }
    else{
        this.brain = new NeuralNetwork(4,4,2); 
    }
    this.show = function() {
        fill(255);
        ellipse(this.x, this.y, this.radius, this.radius);
    }
    this.replaceBrain = function(brainData) {
        this.brain.weights_ih.data = brainData.weights_ih.data;
        this.brain.weights_ho.data = brainData.weights_ho.data;
        this.brain.bias_h.data = brainData.bias_h.data;
        this.brain.bias_o.data = brainData.bias_o.data;
    }
    this.think = function (pipes) {
        let inputs = [];
        inputs[0] = this.y/height;
        inputs[1] = (pipes[0].x-this.x)/width;
        inputs[2] = pipes[0].top/height;
        inputs[3] = pipes[0].bottom/height;

        let output = this.brain.predict(inputs);
        if(output[0] > output[1]){
            this.up();
        }
    }


    this.update = function() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if(this.y > height-this.radius/2){
            this.velocity = 0;
            this.y = height-this.radius/2;
        }
        if(this.y < 0 + this.radius/2){
            this.velocity = 0;
            this.y = 0 + this.radius/2;
        }
    }

    this.up = function(){
        this.velocity = 0;
        this.velocity += -this.gravity*10;
    }

    this.mutate = function() {
        this.brain.mutate(0.1);
    }
}