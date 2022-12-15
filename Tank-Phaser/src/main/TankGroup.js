import { Player, Enemy } from './Tank.js'

const UP = 0
const RIGHT = 1
const DOWN = 2
const LEFT = 3

/**
 * 玩家坦克组
 *  */ 
class PlayerGroup extends Phaser.Physics.Arcade.Group  {
  constructor(world, scene, playerBirthPosition, mapArea, players, onPlayerMsgChange) {
    super(world, scene)

    this.onPlayerMsgChange = onPlayerMsgChange

    // 玩家坦克类型
    this.tankTypes = {
      'player1': [
        {name: 'player1', grade: 1, moveSpeed: 100, bulletNum: 1, bulletSpeed: 200, frame: 0},
        {name: 'player1', grade: 2, moveSpeed: 100, bulletNum: 1, bulletSpeed: 300, frame: 2},
        {name: 'player1', grade: 3, moveSpeed: 100, bulletNum: 2, bulletSpeed: 300, frame: 4},
        {name: 'player1', grade: 4, moveSpeed: 100, bulletNum: 2, bulletSpeed: 300, frame: 6}
      ],
      'player2': [
        {name: 'player2', grade: 1, moveSpeed: 100, bulletNum: 1, bulletSpeed: 200, frame: 0},
        {name: 'player2', grade: 2, moveSpeed: 100, bulletNum: 1, bulletSpeed: 300, frame: 2},
        {name: 'player2', grade: 3, moveSpeed: 100, bulletNum: 2, bulletSpeed: 300, frame: 4},
        {name: 'player2', grade: 4, moveSpeed: 100, bulletNum: 2, bulletSpeed: 300, frame: 6}
      ]
    }
    // 玩家坦克的出生位置
    this.playerBirthPosition = playerBirthPosition

    this.players = players

    this.playerControls = {
      'player1': {
        'KeyW': UP,
        'KeyS': DOWN,
        'KeyA': LEFT,
        'KeyD': RIGHT,
        'Space': 'shoot'
      },
      'player2': { 
        'ArrowUp': UP,
        'ArrowDown': DOWN,
        'ArrowLeft': LEFT,
        'ArrowRight': RIGHT,
        'Numpad0': 'shoot'
      }
    }

    this.mapArea = mapArea

    this.cursors = this.scene.input.keyboard.createCursorKeys()

    this.createAnimation()

    // this.onKeyboard2()

    this.setPlayerKeys()
  }

  start() {
    this.createPlayers()
  }

  // 创建玩家坦克
  createPlayers(){
    const { tileWidth, tileHeight, width: mapWidth, height: mapHeight, x: mapX, y: mapY } = this.mapArea
    this.playerBirthPosition.forEach(({ row, col }, index) => {
      const playerMsg = this.players[index]
      if(playerMsg){
        const { name, grade } = playerMsg 
        const x = mapX + ( col + 0.5) * tileWidth - mapWidth / 2 + 8
        const y = mapY + ( row + 0.5 ) * tileHeight - mapHeight / 2 + 8
        
        const playerTank = this.createTank(x, y, name, grade)
        playerMsg.tank = playerTank
        this[name] = playerTank
      }
    })
  }

  // 生成玩家坦克
  createTank(x, y, name, grade){
    if(grade <= 4){
      const { moveSpeed, bulletNum, bulletSpeed, frame } = this.tankTypes[name][grade - 1]

      const player = new Player({scene: this.scene, x, y, key: name, frame, name, grade, haveProp: false, moveSpeed, bulletNum, bulletSpeed, direction: UP})
      this.add(player)
      player.crashSound = 'playerCrack'
      // player.moveSound = 'move'
      player.isProtected = true

      return player
    }
  }

  // 生成玩家坦克动画
  createAnimation(){
    // 创建玩家坦克动画
    const tankNames = Object.keys(this.tankTypes)

    tankNames.forEach(tankName => {
      for(let grade = 1; grade <= 4; grade += 1){
        const { frame } = this.tankTypes[tankName][grade - 1]

        this.scene.anims.create({
          key: `${tankName}-${grade}-move`,
          frames: this.scene.anims.generateFrameNumbers(`${tankName}`, { start: frame, end: frame + 1 }),
          frameRate: 10,
          repeat: -1
        })
        
        this.scene.anims.create({
          key: `${tankName}-${grade}-stay`,
          frames: [{key: `${tankName}`, frame}]
        })
      }
    })

    // 坦克防护罩动画
    this.scene.anims.create({
      key: 'shield',
      frames: this.scene.anims.generateFrameNumbers(`shield`, {start: 0, end: 1}),
      frameRate: 5,
      repeat: -1
    })

    // 坦克爆炸动画
    this.scene.anims.create({
      key: 'tank-explode',
      frames: this.scene.anims.generateFrameNumbers('tankExplode', {start: 2, end: 0}),
      frameRate: 8,
      repeat: 0,
      hideOnComplete: true
    })
  }
  
  // 监听键盘事件
  onKeyboard(){
    if(this.cursors.up.isDown){
      this.player1 && this.player1.move(UP)
      // this.player2 && this.player2.move(UP)
    }
    if(this.cursors.right.isDown){
      this.player1 && this.player1.move(RIGHT)
      // this.player2 && this.player2.move(RIGHT)
    }
    if(this.cursors.down.isDown){
      this.player1 && this.player1.move(DOWN)
      // this.player2 && this.player2.move(DOWN)
    }
    if(this.cursors.left.isDown){
      this.player1 && this.player1.move(LEFT)
      // this.player2 && this.player2.move(LEFT)
    }
    if(!this.cursors.left.isDown && !this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.down.isDown){
      this.player1 && this.player1.stay()
      // this.player2 && this.player2.stay()
    }

  }
  onKeyboard2(){
    this.scene.input.keyboard.on("keydown-SPACE",() => {
      if(this.player1 && this.player1.active){
        this.player1.shoot()
      }
      if(this.player2 && this.player2.active){
        this.player2.shoot()
      }
    },this.scene)
    let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] 
    // arr.forEach(key => {
    //   this.scene.input.keyboard.on(`keydown-${key}`,(e) => {
    //     console.log('keydown', key, e)
    //   },this.scene)
    // })

    this.scene.input.keyboard.on(`keydown`,(e) => {
      console.log('keydown', e)
      switch(e.key){
        case 'w': this.player1.move(UP); break;
        case 's': this.player1.move(DOWN); break;
        case 'a': this.player1.move(LEFT); break;
        case 'd': this.player1.move(RIGHT); break;
        // case 'space': this.player1.shoot(); break;
      }
    },this.scene)
    this.scene.input.keyboard.on(`keyup`,(e) => {
      console.log('keyup', e)
      if(e.key !== 'space'){
        // this.player1.stay()
      }
      
    },this.scene)
    
  }

  // 键位设置
  setPlayerKeys(){

    // 存在玩家同时按下多个移动键位的情况，如果只存储最后一次键位，当最后一次按下的移动键位弹起时，上一个移动键位没有弹起，则需要重新抬起再按下才会移动，影响操作
    // 这里存储了用户按下的多个移动键位，当最后一次移动键位弹起，会继续上一次的移动键位
    // 比如：先按下“上”，再按下“右”，坦克向右移动；当“右”键抬起时，会执行“上”的动作
    this.scene.input.keyboard.on("keydown",(e) => {
      const key = e.code

      this.players.forEach(player => {
        const controls = this.playerControls[player.name]
        if(key in controls && controls[key] !== 'shoot'){
          // 给玩家创建键位数组，用于保存按下的键位
          if(!Array.isArray(player.keys)){
           player.keys = [] 
          }

          if(!player.keys.includes(key)){
            player.keys.push(key)
          }
        }
        
        // 响应玩家shoot
        if(key in controls && controls[key] === 'shoot'){
          player.tank.shoot()
        }
      })

    },this.scene)

    this.scene.input.keyboard.on("keyup",(e) => {
      const key = e.code 
      this.players.forEach(player => {

        // 键位弹起，将键位从玩家的键位列表里删除
        if(Array.isArray(player.keys) && player.keys.includes(key)){
          player.keys.splice(player.keys.indexOf(e.code), 1)
        }
        // 当玩家的键位列表为空时，玩家坦克停止移动
        if(Array.isArray(player.keys) && player.keys.length == 0){
          player.tank.stay()
        }
      })
      
    },this.scene)
  }

  // 键位功能响应
  onPlayerKeyboard(){
    this.players.forEach(player => {
      const controls = this.playerControls[player.name]

      if(Array.isArray(player.keys) && player.keys.length > 0){
        const len = player.keys.length
        const key = player.keys[ len - 1]
        const direction = controls[key]
        player.tank.move(direction)
      }
    })
  }
}


/**
 * 敌方坦克组
 */
class EnemyGroup extends Phaser.Physics.Arcade.Group  {
  constructor(world, scene, enemyBirthPosition, mapArea, totalTankNum, maxDisplayNum) {
    super(world, scene)

    this.tankTypes  = {
      'enemy1-1': [
        {name: 'enemy1', grade: 1, haveProp: false, frame: 0, moveSpeed: 100},
        {name: 'enemy1', grade: 1, haveProp: true, frame: 2, moveSpeed: 100}, 
      ],
      'enemy2-1': [
        {name: 'enemy2', grade: 1, haveProp: false, frame: 4, moveSpeed: 150},
        {name: 'enemy2', grade: 1, haveProp: true, frame: 6, moveSpeed: 150},
      ],
      'enemy3-1': [
        {name: 'enemy3', grade: 1, haveProp: false, frame: 12, moveSpeed: 100},
        {name: 'enemy3', grade: 1, haveProp: true, frame: 14, moveSpeed: 100},
      ],
      'enemy3-2': [
        {name: 'enemy3', grade: 2, haveProp: false, frame: 10, moveSpeed: 100},
        {name: 'enemy3', grade: 2, haveProp: true, frame: 14, moveSpeed: 100},
      ],
      'enemy3-3': [
        {name: 'enemy3', grade: 3, haveProp: false, frame: 8, moveSpeed: 100},
        {name: 'enemy3', grade: 3, haveProp: true, frame: 14, moveSpeed: 100},
      ]
    }
    this.enemyBirthPosition = enemyBirthPosition
    this.mapArea = mapArea

    this.propTankRatio = 0.3    // 敌方坦克携带工具的坦克的比例
    this.intervalTime = 3000  // 坦克生成的间隔时间
    this.positionIndex = 0
    this.totalTankNum = totalTankNum
    this.maxDisplayNum = maxDisplayNum
    
    this.createAnimation()
  }

  start(cb){
    this.createEnemys()
    let timer = setInterval(() => {
      // 摧毁的坦克数小于总坦克数，并且展示的坦克数小于最大展示的坦克数，则生成一个坦克
      const tankAliveNum = this.countActive(true)
      const tankUnaliveNum = this.countActive(false)

      if((tankAliveNum + tankUnaliveNum) >= this.totalTankNum && tankAliveNum === 0){

        clearInterval(timer)
        cb && cb()
      }else if( (tankAliveNum + tankUnaliveNum) < this.totalTankNum && tankAliveNum < this.maxDisplayNum){
        this.createEnemys()
      }
    }, this.intervalTime)
  }
  
  // 创建敌方坦克并放置到地图上
  createEnemys(){
    const { tileWidth, tileHeight, width: mapWidth, height: mapHeight, x: mapX, y: mapY } = this.mapArea
    const positionNum = this.enemyBirthPosition.length

    // 随机选取一个坦克的位置
    // const index = Phaser.Math.Between(0, positionNum - 1)
    const {col, row} = this.enemyBirthPosition[this.positionIndex]
    this.positionIndex = (this.positionIndex + 1) % positionNum

    const x = mapX + ( col + 0.5) * tileWidth - mapWidth / 2 + 8
    const y = mapY + ( row + 0.5 ) * tileHeight - mapHeight / 2 + 8

    // 随机生成一种坦克
    const tankesNames = Object.keys(this.tankTypes)
    const tankTypesNum = tankesNames.length

    const ran = Phaser.Math.Between(0, tankTypesNum - 1)
    const tankName = tankesNames[ran]

    const ran2 = Phaser.Math.Between(0, 10) < (this.propTankRatio * 10)? 1: 0
    const {name, grade, haveProp} = this.tankTypes[tankName][ran2 ]

    this.createTank(x, y, name, grade, haveProp)
  }
  
  // 生成一种类型的坦克坦克
  createTank(x, y, name, grade, haveProp){
    const tankMsg = this.tankTypes[`${name}-${grade}`]

    if(tankMsg){
      const {frame, moveSpeed, bulletNum, bulletSpeed} = tankMsg[haveProp? 1: 0]
      
      // 生成敌方坦克
      const enemy = new Enemy({scene: this.scene, x, y, key: 'enemy', frame, name, grade, haveProp, moveSpeed, bulletNum, bulletSpeed, direction: DOWN})
      this.add(enemy)

      enemy.crashSound = 'enemyCrack'
      enemy.isAI = true
      
    }else{
      console.log('不存在此坦克，无法创建', name, grade)
    }
  }

  // 创建敌方坦克需要的动画
  createAnimation(){
    for(const tankType in this.tankTypes){
      this.tankTypes[tankType].forEach(({name, grade, haveProp, frame}) => {
        
        this.scene.anims.create({
          key: `${name}-${grade}${haveProp? '-prop': ''}-move`,
          frames: this.scene.anims.generateFrameNumbers('enemy', { start: frame, end: frame + 1 }),
          frameRate: 10,
          repeat: -1
        })
        
        this.scene.anims.create({
          key: `${name}-${grade}${haveProp? '-prop': ''}-stay`,
          frames: [{key: 'enemy', frame}]
        })
      })
    }

    // 敌方坦克出生动画
    this.scene.anims.create({
      key: `enemy-bore`,
      frames: this.scene.anims.generateFrameNumbers('enemyBore', { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    })

  }
}

export {
  PlayerGroup,
  EnemyGroup
}