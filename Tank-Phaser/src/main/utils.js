const UP = 0
const RIGHT = 1
const DOWN = 2
const LEFT = 3

// 检测obj是否与世界边缘碰撞
function isHitWorld (obj) {
  const gameWidth = obj.scene.game.config.width
  const gameHeight = obj.scene.game.config.height


  const objLeft = obj.x - obj.width / 2
  const objRight = obj.x + obj.width / 2
  const objTop = obj.y - obj.height / 2 
  const objBottom = obj.y + obj.height / 2


  if((obj.direction === UP && objTop <= 0) || (obj.direction === RIGHT && objRight >= gameWidth) || (obj.direction === DOWN && objBottom >= gameHeight) || (obj.direction === LEFT && objLeft <= 0)){
    return true
  }else{
    return false
  }
}




export {
  isHitWorld,
}