/**
 * 地图数组
 * 1：砖块 2：铁墙 3：草 4：水 5：冰 9：家
 */

const BRICK = 1
const BRICK2 = 8   // 老家附近的砖块
const IRON = 2
const IRON2 = 7    // 老家附近的铁块
const GRASS = 3
const WATER = 4
const ICE = 5
const HOME = 9

class MapGroup extends Phaser.Physics.Arcade.StaticGroup{
  constructor(world, scene, mapArea, playerBirthPosition, enemyBirthPosition){
    super(world, scene)

    this.x = mapArea.x
    this.y = mapArea.y
    this.width = mapArea.width
    this.height = mapArea.height
    this.background = null

    this.resourceWidth = 16
    this.resourceHeight = 16
    this.mapData = []
    this.home = null
    this.homeBricks = []
    this.homeIronsTime = 10000
    this.homeIronsBlikTime = 3000
    this.playerBirthPosition = playerBirthPosition
    this.enemyBirthPosition = enemyBirthPosition

    this.createAnimation()
    this.createMapBackground()
  }
  // 将地图上玩家和敌方坦克的坐标的资源都置空
  formateMap(){
    // 将玩家出生点的地图资源设为0，并且创建玩家
    this.playerBirthPosition.forEach(({row, col}) => {
      this.mapData[row][col] = 0
      this.mapData[row + 1][col] = 0
      this.mapData[row][col + 1] = 0
      this.mapData[row + 1][col + 1] = 0
    })

    // 将敌人出生点的地图资源设为0，并且创建敌人
    this.enemyBirthPosition.forEach(({row, col}) => {
      this.mapData[row][col] = 0
      this.mapData[row + 1][col] = 0
      this.mapData[row][col + 1] = 0
      this.mapData[row + 1][col + 1] = 0
    })
    
  }


  // 创建地图背景
  createMapBackground(){
    const {x, y, width, height} = this
     this.background = this.scene.add.rectangle(this.x, this.y, this.width, this.height, '0x000000')

    const top = this.scene.add.rectangle(x, y - height / 2 - 1, width, 2,)
    const bottom = this.scene.add.rectangle(x, y + height / 2 + 1, width, 2)
    const right = this.scene.add.rectangle(x - width / 2 - 1, y, 2, height)
    const left = this.scene.add.rectangle(x + width / 2 + 1, y, 2, height)

    top.name = 'edge'
    bottom.name = 'edge'
    right.name = 'edge'
    left.name = 'edge'
    this.add(top)
    this.add(bottom)
    this.add(right)
    this.add(left)
  }

  // 生成某关卡的地图
  createMap(mapData){
    this.mapData = mapData

    this.formateMap()

    for(let i = 0; i < this.mapData.length; ++i){
      for(let j = 0; j < this.mapData[i].length; ++j){
        const code = this.mapData[i][j]

        const x = this.x + ( j + 0.5) * this.resourceWidth - this.width / 2
        const y = this.y + ( i + 0.5 ) * this.resourceHeight - this.height / 2

        switch(code){
          case BRICK: this.createBrick(x , y); break;
          case BRICK2: this.createBrick(x , y, true); break;
          case IRON: this.createIron(x, y); break;
          case GRASS: this.createGrass(x, y); break;
          case WATER: this.createWater(x, y); break;
          case HOME: this.createHome(x, y); break;
          case ICE: this.createIce(x, y); break;
          default:  break;
        }

      }
    }
  }

  // 生成动画
  createAnimation(){
    this.scene.anims.create({
      key: 'wave',
      frames: this.scene.anims.generateFrameNumbers('mapTile', {start: 3, end: 4}),
      frameRate: 2,
      repeat: -1
    })


    this.scene.anims.create({
      key: 'home-brick',
      frames: [{key: 'mapTile', frame: 0}],
    })

    this.scene.anims.create({
      key: 'home-iron',
      frames: [{key: 'mapTile', frame: 1}],
    })
 
    this.scene.anims.create({
      key: 'home-iron-blik',
      frames: [{key: 'mapTile', frame: 0}, {key: 'mapTile', frame: 1}],
      frameRate: 2,
      repeat: -1
    })
  }

  // 生成砖块
  createBrick(x, y, isHomeBrick){
    const brick = this.scene.physics.add.staticSprite(x, y, 'mapTile', 0)
    brick.name = 'brick'
    this.add(brick)

    // 老巢附近的砖块特殊处理，用于在拾取道具后更换
    if(isHomeBrick){
      brick.name = 'home-brick'
      
      this.homeBricks.push({x, y})
    }
  }

  // 生成铁墙
  createIron(x, y, isHomeIron){
    const iron = this.scene.physics.add.staticSprite(x, y, 'mapTile', 1)
    iron.name = 'iron'
    this.add(iron)
    
    // 老巢附近的铁块R
    if(isHomeIron){
      iron.name = 'home-iron'
      
      // homeIronTime之后，开始闪烁
      this.scene.time.addEvent({
        delay: this.homeIronsTime,
        callback: () => {
          if(iron.active){
            iron.anims.play('home-iron-blik')
          }
        },
        callbackScope: this.scene
      })

      // 闪烁homeIronsBlikTime时间后，铁块转为砖块
      this.scene.time.addEvent({
        delay: this.homeIronsTime + this.homeIronsBlikTime,
        callback: () => {
          if(iron.active){
            iron.anims.play('home-brick')
            iron.name = 'home-brick'
          }
        },
        callbackScope: this.scene
      })
    }
  }

  // 生成树，树不加到地图数组里,不参与碰撞
  createGrass(x, y){
    const grass = this.scene.physics.add.sprite(x, y, 'mapTile', 2)
    grass.name = 'grass'
    grass.setDepth(2)
  }

  // 生成水
  createWater(x, y){
    const water = this.scene.physics.add.staticSprite(x, y, 'mapTile', 3)
    water.name = 'water'
    water.anims.play('wave')
    this.add(water)
  }

  // 生成冰
  createIce(x, y){
    // const ice = this.scene.physics.add.staticSprite(x, y, 'mapTile', 3)
    // ice.name = 'ice'
    // this.add(ice)
  }
  
  // 生成Home
  createHome(x, y){
    const home = this.scene.physics.add.staticSprite(x + 8, y +8, 'nest')
    home.name = 'home'
    this.add(home)
  }

  // 子弹击中地图
  isShooted(bullet, map){
    // 击中水、雪不做操作
    if(map.name === 'water' || map.name === 'ice') return

    // 击中砖块
    if(map.name === 'brick' || map.name === 'home-brick'){
      map.destroy(true)
    }else if(map.name === 'iron' || map.name === 'home-iron'){
      if(bullet.owner.name.indexOf('player') > -1){
        this.playSound('bulletCrack')
      }
      
      // 四级坦克可以消铁块
      if(bullet.owner.grade === 4){
        map.destroy(true)
      }
    }else if(map.name === 'home'){ // 击中老巢，游戏结束
      this.scene.physics.add.staticSprite(map.x, map.y, 'nestDestroyed')

      this.gameOver()
      
      map.destroy(true)
    }else if(map.name === 'edge'){
      if(bullet.owner.name.indexOf('player') > -1){
        this.playSound('bulletCrack')
      }
    }
    bullet.crash()
  }

  // 更换老巢附近的砖块
  switchHome(){
    console.log('开始切换砖块', this)
    // 先销毁老巢附近的砖块/铁块，再重新创建新的铁块
    this.getChildren().forEach(item => {
      if(item.name === 'home-brick' || item.name === 'home-iron'){
        item.destroy(true)
      }
    })
    
    // 创建老巢附近的铁块
    this.homeBricks.forEach(item => {
      this.createIron(item.x, item.y, true)
    })
    
  }

  // 游戏结束
  gameOver(){
    const x = this.scene.game.config.width / 2
    const y = this.scene.game.config.height - 16
    const gameOver = this.scene.physics.add.image(x, y, 'gameOver')
    gameOver.setDepth(4)
    this.playSound('playerCrack')

    this.scene.tweens.add({
      targets: gameOver,
      y: this.scene.game.config.height / 2,
      ease: "Sine.easeOut",
      duration: 5000,
    })
  }

  playSound(soundName){
    if(soundName){
      this.scene.sound.play(soundName)
    }
  }
}



export default MapGroup