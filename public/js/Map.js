
class Map{
  constructor(level){
    console.log('level', level )
    this.level = level | 1;
    this.container = new Container()
    this.offsetX =32;      //主游戏区的X偏移量
    this.offsetY = 16;     //主游戏区的Y偏移量
    this.wTileCount = 26;  //主游戏区的宽度地图块数
    this.hTileCount = 26;  //主游戏区的高度地图块数
    this.tileSize = 16;    //地图块的大小
    this.homesSize = 32;   //家图标的大小
    this.num = null;
    this.mapWidth = 416;
    this.mapHeight = 416;

    this.setMapLevel(this.level)
  }

  setMapLevel(level){
    this.level = level;
    let tempMap = eval(`map${this.level}`)
    this.mapLevel = []
    for(let i = 0; i < tempMap.length; i++){
      this.mapLevel[i] = []
      for(let j = 0; j < tempMap[i].length; j++){
        this.mapLevel[i][j] = tempMap[i][j]
      }
    }
  } 

  init(){
    let gameArea = new Graphics();
    gameArea.beginFill(0xff0000)
    gameArea.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    gameArea.endFill();

    //主游戏区
    let mainArea = new Graphics();
    mainArea.beginFill(0x000)
    mainArea.drawRect(this.offsetX, this.offsetY, this.mapWidth, this.mapHeight)
    mainArea.endFill();

    this.container.addChild(gameArea, mainArea)
    app.stage.addChild(this.container)

    for(let i = 0; i < this.hTileCount; i++){
      for(let j = 0; j < this.wTileCount; j++){
        let item = this.mapLevel[i][j]
        if(item == WALL || item == GRID || item == WATER || item == ICE){
          let wallSprite = Sprite.from(tankTextures['build_wall.png'])
          wallSprite.position.set(j * this.tileSize + this.offsetX, i * this.tileSize + this.offsetY)
          wallSprite.width = this.tileSize
          wallSprite.height = this.tileSize
          this.container.addChild(wallSprite)
        }else if(item == GRASS){
          let grassSprite = Sprite.from(tankTextures['build_grass.png'])
          grassSprite.position.set(j * this.tileSize + this.offsetX, i * this.tileSize + this.offsetY)
          grassSprite.width = this.tileSize
          grassSprite.height = this.tileSize
          this.container.addChild(grassSprite)
        }else if(item == HOME){
          let homeSprite = Sprite.from(tankTextures['home.png'])
          homeSprite.position.set(j * this.tileSize + this.offsetX, i * this.tileSize + this.offsetY)
          homeSprite.width = this.homesSize
          homeSprite.height = this.homesSize
          this.container.addChild(homeSprite)

          //家被摧毁
          // let homeDestroyedSprite = Sprite.from(tankTextures['home_destroyed.png'])
          // homeDestroyedSprite.position.set(j * this.tileSize + this.offsetX, i * this.tileSize + this.offsetY)
          // homeDestroyedSprite.width = this.homesSize
          // homeDestroyedSprite.height = this.homesSize
          // this.container.addChild(homeDestroyedSprite)
        }
      }
    }
    this.homeHit()
  }

  /**
   * 画固定不变的部分
   * */ 
  drawNoChange(){

  }

  /**
   * 画关卡数
   * */ 
  drawLevel(){

  }

  /**
   * 画右侧地方坦克数
   * */ 
  drawEnemyNum(enemyNum){

  }
  /**
   * 清除右侧地方坦克数，从最下面开始清除
   * */ 
  clearEnemyNum(totalEnemyNum, enemyNum){

  }
  /**
   * 画坦克的生命数
   * */ 
  drawLeves(lives, type){

  }
  /**
   * 更新地图
   * */ 
  updateMap(indexArr, target){
    if(indexArr != null && indexArr.length > 0){
      let indexSize = indexArr.length;
      for(let i = 0; i < indexSize; i++){
        let index = indexArr[i]
        this.mapLevel[index[0]][index[1]] = target;

        if(target > 0){

        }else{

        }
      }
    }
  }
  homeHit(){
    
  }
}