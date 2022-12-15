/**
 * 检测2个物体是否碰撞
 * 
 * */ 
function CheckIntersect(object1, object2, overlap = 0){
  //    x-轴                      x-轴
	//  A1------>B1 C1              A2------>B2 C2
	//  +--------+   ^              +--------+   ^
	//  | object1|   | y-轴         | object2|   | y-轴
	//  |        |   |              |        |   |
	//  +--------+  D1              +--------+  D2
	//
  //overlap是重叠的区域值
  let A1 = object1.x - object1.size / 2 + overlap
  let B1 = object1.x + object1.size / 2 - overlap
  let C1 = object1.y - object1.size / 2 + overlap
  let D1 = object1.y + object1.size / 2 - overlap

  let A2 = object2.x - object2.size / 2 + overlap
  let B2 = object2.x + object2.size / 2 - overlap
  let C2 = object2.y - object2.size / 2 + overlap
  let D2 = object2.y + object2.size / 2 - overlap

  //判断在x轴重叠
  if((A1 >= A2 && A1 <= B2) || (B1 >= A2 && B1 <= B2)){
    if((C1 >= C2 && C1 <= D2) || (D1 >= C2 && D1 <= D2)){
      return true
    }
  }
  return false
}

/**
 * 坦克与地图块碰撞
 * */ 
function tankMapCollision(tank, mapObj){
  
  //移动检测，记录最后一次的移动方向，根据方向判断+-overlap
  let tileNum = 0;  //需要检测的tile数
  let rowIndex = 0; //map中的行索引
  let colIndex = 0; //map中的列索引
  let overlap = 0;  //允许重叠的大小



  switch(tank.dir){
    case UP: {
      rowIndex = parseInt((tank.nextY - tank.size / 2 + overlap) / mapObj.tileSize); 
      colIndex = parseInt(tank.nextX / mapObj.tileSize)
      break;
    }
    case RIGHT: {
      rowIndex = parseInt(tank.nextY / mapObj.tileSize)
      colIndex = parseInt((tank.nextX + tank.size / 2 - overlap) / mapObj.tileSize); 
      break;
    }
    case DOWN: {
      rowIndex = parseInt((tank.nextY + tank.size / 2 - overlap) / mapObj.tileSize); 
      colIndex = parseInt(tank.nextX / mapObj.tileSize)
      break;
    }
    case LEFT: {
      rowIndex = parseInt(tank.nextY / mapObj.tileSize)
      colIndex = parseInt((tank.nextX - tank.size / 2 + overlap) / mapObj.tileSize); break;
    }
  }

  //超出地图
  if(rowIndex > mapObj.hTileCount || rowIndex < 0 || colIndex > mapObj.wTileCount || colIndex < 0){
    console.log('超出地图')
    return true
  }
  //检测是否碰撞地图块
  let mapContent = mapObj.mapLevel[rowIndex][colIndex];
  if(mapContent == WALL || mapContent == GRID || mapContent == WATER || mapContent == HOME || mapContent == ANOTHERHOME){
    console.log('碰撞地图')
    return true;
  }else{
    return false
  }
}

/**
 * 子弹与地图块的碰撞
 * */ 
function bulletMapCollision(bullet, mapObj){
  let tileNum = 0;  //需要检测的tile数
  let rowIndex = 0; //map中的行索引
  let colIndex = 0; //map中的列索引
  let mapChangeIndex = []  //map中需要更新的索引数组
  let result = false   //是否发生碰撞

  //根据bullet的x,y计算出map中的row和col
  switch(bullet.dir){
    case UP: {
      rowIndex = parseInt(bullet.y / mapObj.tileSize)
      colIndex = parseInt(bullet.x / mapObj.tileSize)
      break;
    }
    case DOWN: {
      rowIndex = parseInt((bullet.y + bullet.size) / mapObj.tileSize)
      colIndex = parseInt(bullet.x / mapObj.tileSize)
      break;
    }
    case LEFT: {
      rowIndex = parseInt(bullet.y / mapObj.tileSize)
      colIndex = parseInt(bullet.x / mapObj.tileSize)
      break;
    }
    case RIGHT: {
      rowIndex = parseInt(bullet.y / mapObj.tileSize)
      colIndex = parseInt(bullet.x + bullet.size / mapObj.tileSize)
      break;
    }
  }

  if(rowIndex >= mapObj.hTileCount || rowIndex < 0 || colIndex >= mapObj.wTileCount || colIndex < 0){
    return
  }

  if(bullet.dir == UP || bullet.dir == DOWN){
    let tempWidth = parseInt(bullet.x - colIndex * mapObj.tileSize + bullet.size)

    if(tempWidth % mapObj.tileSize == 0){
      tileNum = parseInt(tempWidth / mapObj.tileSize)
    }else{
      tileNum = parseInt(tempWidth / mapObj.tileSize) + 1;
    }
    for(let i = 0; i < tileNum && (colIndex + i) < mapObj.wTileCount; i++){
      let mapContent = mapObj.mapLevel[rowIndex][colIndex + 1]
      if(mapContent == WALL || mapContent == GRID || mapContent == HOME || mapContent == ANOTHERHOME){
        result = true;
        if(mapContent == WALL){
          //墙被打掉
          mapChangeIndex.push([rowIndex, colIndex + i])
        }else if(mapContent == GRID){

        }else{
          isGameOver = true;
          break;
        }
      }
    }
  }else {
    let tempHeight = parseInt(bullet.y - rowIndex * mapObj.tileSize + bullet.size)
    if(tempHeight % mapObj.tileSize == 0){
      tileNum = parseInt(tempHeight / mapObj.tileSize)
    }else{
      tileNum = parseInt(tempHeight / mapObj.tileSize) + 1;
    }
    for(let i = 0; i < tileNum && (rowIndex + i) < mapObj.hTileCount; i++){
      let mapContent = mapObj.mapLevel[rowIndex + i][colIndex]
      if(mapContent == WALL || mapContent == GRID || mapContent == HOME || mapContent == ANOTHERHOME){
        result = true;

        if(mapContent == WALL){
          //墙被打掉
          mapChangeIndex.push([rowIndex + i, colIndex])
        }else if(mapContent == GRID){

        }else{
          isGameOver = true;
          break;
        }
      }

    }
    //更新地图
    map.updateMap(mapChangeIndex, 0)
    return result;
  }
}