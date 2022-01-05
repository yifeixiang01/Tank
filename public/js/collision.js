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
  let overlap = 3;  //允许重叠的大小


  //根据坦克的x,y 计算出坦克在map中的row和col
  switch(tank.dir){
    case UP: {
      rowIndex = parseInt((tank.y + overlap - map.offsetY) / mapObj.tileSize)
      colIndex = parseInt((tank.x + overlap - map.offsetX) / mapObj.tileSize)
      break;
    }
    case RIGHT: {
      rowIndex = parseInt((tank.y + overlap - mapObj.offsetY) / mapObj.tileSize)
      colIndex = parseInt((tank.x - overlap - mapObj.offsetX + tank.size) / mapObj.tileSize)
    }
    case DOWN: {
      rowIndex = parseInt((tank.y - overlap - mapObj.offsetY + tank.size + tank.size) / mapObj.tileSize)
      colIndex = parseInt((tank.x + overlap - mapObj.offsetX) / mapObj.tileSize)
      break;
    }
    case LEFT: {
      rowIndex = parseInt((tank.y + overlap - mapObj.offsetY) / mapObj.tileSize)
      colIndex = parseInt((tank.x + overlap - mapObj.offsetX ) / mapObj.tileSize)
    }
  }

  //超出地图
  if(rowIndex >= mapObj.hTileCount || rowIndex < 0 || colIndex >= mapObj.wTileCount || colIndex < 0){
    return true
  }

  if(tank.dir === UP || tank.dir === DOWN){
    //去除重叠部分
    let tempWidth = parseInt(tank.x - map.offsetX - colIndex * mapObj.tileSize + tank.size - overlap)
    if(tempWidth % mapObj.tileSize == 0){
      tileNum = parseInt(tempWidth / mapObj.tileSize)
    }else{
      tileNum = parseInt(tempWidth / mapObj.tileSize) + 1
    }
    for(let i = 0; i < tileNum && (colIndex + i) < mapObj.wTileCount; i++){
      let mapContent = mapObj.mapLevel[rowIndex][colIndex + 1]
      if(mapContent == WALL || mapContent == GRID || mapContent == WATER || mapContent || mapContent == HOME || mapContent == ANOTHERHOME){
        if(tank.dir == UP){
          tank.y = mapObj.offsetY + rowIndex * mapObj.tileSize + mapObj.tileSize - overlap;
        }else if(tank.dir == DOWN){
          tank.y = mapObj.offsetY + rowIndex * mapObj.tileSize - tank.size + overlap;
        }
        return true;
      }
    }
    
  }else{
    let tempHeight = parseInt(tank.y - map.offsetY - rowIndex * mapObj.tileSize + tank.size - overlap)
    if(tempHeight % mapObj.tileSize == 0){
      tileNum = parseInt(tempHeight / mapObj.tileSize)
    }else{
      tileNum = parseInt(tempHeight / mapObj.tileSize)
    }
    for(let i = 0; i < tileNum && (rowIndex + i ) < mapObj.hTileCount; i++){
      let mapContent = mapObj.mapLevel[rowIndex + i ][colIndex]
      if(mapContent == WALL || mapContent == GRID || mapContent == WATER || mapContent == HOME || mapContent == ANOTHERHOME){
        if(tank.dir == LEFT){
          tank.x = mapObj.offsetX + colIndex * mapObj.tileSize + mapObj.tileSize - overlap;
        }else if(tank.dir == RIGHT){
          tank.x = mapObj.offsetX + colIndex * mapObj.tileSize - tank.size + overlap
        }
        return true;
      }
    }
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
      rowIndex = parseInt((bullet.y - mapObj.offsetY) / mapObj.tileSize)
      colIndex = parseInt((bullet.x - mapObj.offsetX) / mapObj.tileSize)
      break;
    }
    case DOWN: {
      rowIndex = parseInt((bullet.y - mapObj.offsetY + bullet.size) / mapObj.tileSize)
      colIndex = parseInt((bullet.x - mapObj.offsetX) / mapObj.tileSize)
      break;
    }
    case LEFT: {
      rowIndex = parseInt((bullet.y - mapObj.offsetY) / mapObj.tileSize)
      colIndex = parseInt((bullet.x - mapObj.offsetX) / mapObj.tileSize)
      break;
    }
    case RIGHT: {
      rowIndex = parseInt((bullet.y - mapObj.offsetY) / mapObj.tileSize)
      colIndex = parseInt((bullet.x - mapObj.offsetX + bullet.size) / mapObj.tileSize)
      break;
    }
  }

  if(rowIndex >= mapObj.hTileCount || rowIndex < 0 || colIndex >= mapObj.wTileCount || colIndex < 0){
    return
  }

  if(bullet.dir == UP || bullet.dir == DOWN){
    let tempWidth = parseInt(bullet.x - map.offsetX - colIndex * mapObj.tileSize + bullet.size)

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
    let tempHeight = parseInt(bullet.y - map.offsetY - rowIndex * mapObj.tileSize + bullet.size)
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

