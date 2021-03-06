
class Map{
  constructor(level){
    console.log('level', level )
    this.level = level | 1;
    this.container = new Container()
    this.mainArea = new Container()
    this.offsetX =32;      //主游戏区的X偏移量
    this.offsetY = 16;     //主游戏区的Y偏移量
    this.wTileCount = 26;  //主游戏区的宽度地图块数
    this.hTileCount = 26;  //主游戏区的高度地图块数
    this.tileSize = 16;    //地图块的大小
    this.homesSize = 32;   //家图标的大小
    this.num = null;
    this.mapWidth = 416;
    this.mapHeight = 416;
    this.container.sortableChildren = true;
    
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
    app.stage.addChild(this.container)
    //设置游戏区域的整体偏移
    this.container.position.set(100, 32)

    //整个游戏区的背景色
    let gameAreaBg = new Graphics();
    gameAreaBg.beginFill(0xff0000)
    gameAreaBg.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    gameAreaBg.endFill();

    //主游戏区
    this.mainArea.position.set(this.offsetX, this.offsetY, this.mapWidth, this.mapHeight)

    //主游戏区背景色
    let mainAreaBg = new Graphics()
    mainAreaBg.beginFill(0x000)
    mainAreaBg.drawRect(0, 0, this.mapWidth, this.mapHeight)
    mainAreaBg.endFill();
    this.mainArea.addChild(mainAreaBg)
    this.container.addChild(gameAreaBg, this.mainArea)

    for(let i = 0; i < this.hTileCount; i++){
      for(let j = 0; j < this.wTileCount; j++){
        let item = this.mapLevel[i][j]
        
          let sprite;
          if(item == WALL || item == GRID || item == WATER || item == ICE){
            sprite = Sprite.from(tankTextures['build_wall.png'])
            sprite.position.set(j * this.tileSize + this.tileSize / 2, i * this.tileSize + this.tileSize / 2)
            sprite.width = sprite.height = this.tileSize
          }else if(item == GRASS){
            sprite = Sprite.from(tankTextures['build_grass.png'])
            sprite.position.set(j * this.tileSize + this.tileSize / 2, i * this.tileSize + this.tileSize / 2)
            sprite.width = sprite.height = this.tileSize
            sprite.zIndex = 1000
          }else if(item == HOME){
            sprite = Sprite.from(tankTextures['home.png'])
            sprite.width = sprite.height = this.homesSize
            sprite.position.set(j * this.tileSize + this.homesSize / 2, i * this.tileSize + this.homesSize / 2)

            //家被摧毁
            // let homeDestroyedSprite = Sprite.from(tankTextures['home_destroyed.png'])
            // homeDestroyedSprite.position.set(j * this.tileSize + this.offsetX, i * this.tileSize + this.offsetY)
            // this.container.addChild(homeDestroyedSprite)
          }

          if(sprite){
            sprite.anchor.set(0.5, 0.5)
            this.mainArea.addChild(sprite)
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