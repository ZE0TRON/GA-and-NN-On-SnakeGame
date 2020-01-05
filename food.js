function Food() {
  this.x = Math.floor(random(Math.floor(width / GRID_SIZE )-2))*GRID_SIZE + GRID_SIZE;
  this.y = Math.floor(random(Math.floor(height / GRID_SIZE)-2))*GRID_SIZE + GRID_SIZE;
  this.show = function() {
    fill("rgb(0,255,0)");
      rect(this.x, this.y, GRID_SIZE, GRID_SIZE);
    }

  this.hits = function(snake) {
    head = snake.getHeadLocation();
    newX = head.x;
    newY = head.y;
    if (
      (newY == this.y &&
        ((newX <= this.x && snake.x >= this.x) ||
          (newX >= this.x && snake.x <= this.x))) 
          ||
      (newX == this.x &&
        ((newY <= this.y && snake.y >= this.y) ||
          (newY >= this.y && snake.y <= this.y)))
    ) {
      return true;
    }
    return false;

}
}
