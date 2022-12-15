import * as Phaser from 'phaser'


import { PlayerGroup, EnemyGroup } from './TankGroup.js'
import MapGroup from './MapGroup.js'
import BulletGroup from './BulletGroup.js'
import PropsGroup from './PropsGroup.js'


// 敌方坦克的出生地
const enemyBirthPosition = [{col: 0, row: 0}, {col: 12, row: 0}, {col: 24, row: 0}]

// 玩家的出生地
const playerBirthPosition = [
  { col: 8, row: 24 },
  { col: 16, row: 24, }
]

// 游戏主界面
class MainGame extends Phaser.Scene {
  constructor(){
    super()
    
    this.mapArea = {
      x: null,
      y: null,
      width: null,
      height: null,
      tileWidth: 16,
      tileHeight: 16,
    }
    this.tankMsgArea = {
      width: 100,
      height: null,
      paddingLeft: 30,
      paddingTop: 30
    }

    this.mapData = null
    this.mapGroup = null
    this.playerGroup = null
    this.enemyGroup = null
    this.bulletGroup = null
    this.propsGroup = null
    this.tankMessagesContainer = null
    
    this.totalEnemyNum = 20        // 敌方坦克总数
    this.maxDisplayEnemyNum = 4    // 一次最多显示的坦克数量
    this.level = 20              // 当前关卡数
    this.players = [{name: 'player1', grade: 2}, {name: 'player2', grade: 1}]

  }

  preload(){
    this.load.setPath('assets/')

    // 加载地图数据
    this.load.json('mapJson', "map/level.json")

    // 加载游戏图片
    this.load.image('nest', 'images/nest.png')
    this.load.image('bullet', 'images/bullet.png')
    this.load.image('gameOver', 'images/gameOver.png')
    this.load.image('nestDestroyed', 'images/nest_dead.png')

    this.load.image('playerLogo1', 'images/player1_logo.png')
    this.load.image('playerLogo2', 'images/player2_logo.png')
    this.load.image('enemyLogo', 'images/enemy_logo.png')
    this.load.image('playerNumLogo', 'images/player_num_logo.png')
    this.load.image('levelFlag', 'images/flag.png')
    this.load.image('nums', 'images/num.png')
    this.load.bitmapFont


    this.load.spritesheet('player1', 'images/player1.png', { frameWidth: 32, frameHeight: 32})
    this.load.spritesheet('player2', 'images/player2.png', { frameWidth: 32, frameHeight: 32})
    this.load.spritesheet('enemy', 'images/enemy.png', { frameWidth: 32, frameHeight: 32})
    this.load.spritesheet('mapTile', 'images/map_tile.png', { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('shield', 'images/shield.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('tankExplode', 'images/explode.png', { frameWidth: 33, frameHeight: 25 })
    this.load.spritesheet('Props', 'images/bouns.png', { frameWidth: 32, frameHeight: 30 })
    this.load.spritesheet('bulletExplode', 'images/bulletExplode.png', { frameWidth: 33, frameHeight: 33 })
    this.load.spritesheet('enemyBore', 'images/bore.png', { frameWidth: 32, frameHeight: 32 })

    // 加载音频文件
    this.load.audio('move', ['audio/move.mp3'])
    this.load.audio('playerShoot', ['audio/attack.mp3'])
    this.load.audio('playerCrack', ['audio/playerCrack.mp3'])
    this.load.audio('enemyCrack', ['audio/tankCrack.mp3'])
    this.load.audio('bulletCrack', ['audio/bulletCrack.mp3'])
    this.load.audio('gameStart', ['audio/start.mp3'])
    this.load.audio('getProps', ['audio/prop.mp3'])
  } 

  create(){
    // 设置游戏的基础数据
    this.init();

    // 创建地图组
    this.mapGroup = new MapGroup(this.physics.world, this, this.mapArea, playerBirthPosition, enemyBirthPosition)
    // 创建玩家坦克组
    this.playerGroup = new PlayerGroup(this.physics.world, this, playerBirthPosition, this.mapArea, this.players, this.onPlayerMsgChange)
    // 创建敌方坦克组
    this.enemyGroup = new EnemyGroup(this.physics.world, this, enemyBirthPosition, this.mapArea, this.totalEnemyNum, this.maxDisplayEnemyNum)
    // 创建子弹组
    this.bulletGroup = new BulletGroup(this.physics.world, this)
    // 创建奖品管理器
    this.propsGroup = new PropsGroup(this.physics.world, this, this.mapArea)

    // 设置物体之间的碰撞
    this.setTankCollider()

    // 生成关卡地图
    this.mapGroup.createMap(this.mapData)

    // 开始游戏
    this.startGame()
  }

  update(){
    // 监听玩家按键
    this.playerGroup.onKeyboard()

  }

  // 开始游戏，创建玩家坦克和敌方坦克，定时生成道具
  startGame(){
    // 开始生成道具
    this.propsGroup.start()
    
    // 开始创建所有玩家坦克
    this.playerGroup.start(({name, levels, }) => {

    })
    console.log('players', this.players)

    // 开始创建所有敌方坦克
    this.enemyGroup.start(() => {
      console.log('所有坦克已摧毁')

      this.toScoreCount()
    })
  }

  // 设置玩家和敌人、玩家和玩家、敌人和敌人、玩家和老家、敌人和老家的碰撞
  setTankCollider(){

    // 玩家和玩家碰撞
    this.physics.add.collider(this.playerGroup, this.playerGroup)

    // 敌人和敌人碰撞
    this.physics.add.collider(this.enemyGroup, this.enemyGroup)

    // 玩家和敌人碰撞
    this.physics.add.collider(this.playerGroup, this.enemyGroup)

    // 玩家和地图碰撞
    this.physics.add.collider(this.playerGroup, this.mapGroup)

    // 敌人和地图碰撞
    this.physics.add.collider(this.enemyGroup, this.mapGroup)

    // 子弹打到地图
    this.physics.add.overlap(this.bulletGroup, this.mapGroup, (bullet, map) => {
      this.mapGroup.isShooted(bullet, map)
    })

    // 子弹打到敌人
    this.physics.add.overlap(this.bulletGroup, this.enemyGroup, (bullet, enemy) => {
      if(bullet.owner.name.indexOf('player') > -1 && enemy.active){ // 子弹是玩家发射的，则摧毁坦克
        bullet.crash()
        enemy.isShooted()
      }
    })

    // 子弹打到玩家
    this.physics.add.overlap(this.bulletGroup, this.playerGroup, (bullet, player) => {
      if(bullet.owner.name.indexOf('enemy') > -1){ // 子弹是敌人发射的，则摧毁玩家
        bullet.crash()
        player.isShooted()
      }
    })

    // 子弹和子弹碰撞
    this.physics.add.overlap(this.bulletGroup, this.bulletGroup, (bullet1, bullet2) => {
      bullet1.crash()
      bullet2.crash()
    })

    // 玩家和道具
    this.physics.add.overlap(this.playerGroup, this.propsGroup, (player, prop) => {
      this.propsGroup.give(player, prop)
    }) 
  }

  // 绘制主游戏背景
  init(){
    let mapJson = this.cache.json.get('mapJson')
    if(mapJson){
      const { width: gameWidth, height: gameHeight } = this.game.config
      const { width: tankMsgWidth } = this.tankMsgArea
      const { tileWidth, tileHeight } = this.mapArea

      // 本关地图数据
      this.mapData = this.cache.json.get('mapJson')[`map${this.level}`]

      const mapWidth = this.mapData[0].length * tileWidth
      const mapHeight = this.mapData.length * tileHeight
      // 根据地图数据设置地图的大小和位置信息
      this.mapArea = {...this.mapArea, x: gameWidth - tankMsgWidth - mapWidth / 2, y: gameHeight / 2,  width: mapWidth, height: mapHeight}
      // 设置地图右侧坦克信息
      this.tankMsgArea = {...this.tankMsgArea, x: this.mapArea.x + mapWidth / 2, y: (gameHeight - mapHeight) / 2, width: tankMsgWidth, height: mapHeight }

      // 创建右侧坦克人数展示框
      this.createTankMessagesPanel({enemyNum: this.totalEnemyNum, players: this.players, level: this.level})
    }
  }
  

  // 创建右侧显示坦克数量的面板
  createTankMessagesPanel({enemyNum, players, level}){
    const {x, y, width, height, paddingLeft, paddingTop} = this.tankMsgArea

    // 创建一个容器
    this.tankMessagesContainer = this.add.container(x, y)
    
    const enemyLogoWidth = 14
    const enemySpace = 2

    // 创建敌方坦克logo
    for(let i = 0; i < enemyNum; ++i){
      const x = paddingLeft + (enemyLogoWidth + enemySpace) * (i % 2)
      const y = paddingTop + (enemyLogoWidth + enemySpace) * (Math.floor(i / 2))
      const enemyLogo = this.add.image(x, y, 'enemyLogo')


      this.tankMessagesContainer.add(enemyLogo)
    }

    // 创建玩家logo
    const playerNum = this.players.length
    const playerTop = 200
    const playerLogoHeight = 14

    for(let i = 1; i <= playerNum; ++i){
      const x = width / 2
      const y = playerTop + playerLogoHeight / 2 + playerLogoHeight * (i - 1)
      const playerLogo = this.add.image( x, y, `playerLogo${i}` )
      
      this.tankMessagesContainer.add(playerLogo)
    }

    this.livesText = this.add.text(50, 200, 0, {color: '0x000000'})

    this.livesText.on('playerchange', (res) => {
      console.log('监听', res)
    }, this)

    // 当前关卡
    const levelLogo = this.add.image(paddingLeft, height - paddingTop - 9, 'levelFlag')
    const levelText = this.add.text(paddingLeft + 24, height - paddingTop - 9, level, { fontSize: 24, color: '0x000000' })
    levelText.setOrigin(0.5)

    this.tankMessagesContainer.add([levelLogo, levelText])
    
  }

  // 监听玩家信息变更
  onPlayerMsgChange({name, level, killedEnemy}){
    console.log('player message change', name, level, killedEnemy)
  }

  // 跳转游戏结算页面
  toScoreCount(){

  }
}

export default MainGame