import { isHitWorld } from "./utils"

const UP = 0
const RIGHT = 1
const DOWN = 2
const LEFT = 3



// 坦克基类
class Tank extends Phaser.Physics.Arcade.Sprite {
  constructor({scene, x, y, key, frame, name, grade = 1, haveProp = false, moveSpeed = 100, bulletNum = 1, bulletSpeed = 200, direction}){
    super(scene, x, y, key, frame)

    this.x0 = x    // 记录坦克的初始坐标，用于复活的重生点
    this.y0 = y
    this.direction0 = direction
    this.name = name
    this.lives = 1            // 生命数量
    this.grade = grade            // 坦克等级    
    this.haveProp = haveProp     // 是否携带奖励   敌方红色的坦克是携带有奖励箱，
    this.direction = UP      
    this.moveSpeed = moveSpeed
    this.isAI = false
    this.isProtected = false   // 是否有防护罩
    this.shield = null
    this.shieldTime = 10000     // 防护罩时间
    this.shieldTimer = null
    this.isHit = false         // 是否撞到墙或者坦克
    this.shootTimes = 0         // 坦克发射的次数，发射的次数不能大于子弹数
    this.bulletNum = bulletNum     
    this.bullets = []  
    this.bulletSpeed = bulletSpeed
    this.crashSound = ''      //坦克被摧毁的声音
    this.moveSound = ''       // 坦克移动的声音
    this.isMovable = true      // 是否可移动

    // 添加到场景中
    scene.add.existing(this)
    // 添加到物理系统中
    scene.physics.add.existing(this)
    // 设置与世界碰撞
    this.setCollideWorldBounds(true)

    this.setBodySize(27, 27)
    this.setPushable(false)
    this.setDepth(1)
  }

  preUpdate(time, delta){
    super.preUpdate(time, delta)

    if(!this.active) return;

    // 坦克撞到物体则停下来
    if(isHitWorld(this)){
      this.isHit = true
    }

    if(this.isHit){
      this.stay()
    }

    // 有保护罩的坦克显示保护罩，保护罩持续一段时间后消失
    if(this.isProtected){
      if(!this.shield || !this.shield.active){
        this.createShield()
      }

      this.shield.x = this.x
      this.shield.y = this.y
    }
  }

  move(direction){
    if(!this.active) return;

    if(!this.isMovable) return;

    // 设置坦克的方向
    this.setDirection(direction)

    // 播放移动的动画
    this.playAnimation('move')

    // 如果撞到其它物体，则只能转向不能移动
    if(this.isHit) {
      this.isHit = false
      return
    }
    // 设置该方向上的速度，开始移动
    switch(this.direction){
      case LEFT: this.setVelocity(-this.moveSpeed, 0); break;
      case UP: this.setVelocity(0, -this.moveSpeed); break;
      case RIGHT: this.setVelocity(this.moveSpeed, 0); break;
      case DOWN: this.setVelocity(0, this.moveSpeed); break;
      default: ; break;
    }

    // 播放移动的声音
    this.playSound(this.moveSound, true)
  }

  // 设置坦克的方向
  setDirection(direction){
    this.direction = direction
    this.setRotation(Math.PI / 2 * direction)
  }
  
  checkMovable(otherObj){
    const distanceX = Math.abs(this.x - otherObj.x)
    const distanceY = Math.abs(this.y - otherObj.y)
    const totalWidth = (this.width + otherObj.width) / 2 - 4
    const totalHeight = (this.height + otherObj.height) / 2 - 4

    if(this.direction === UP && this.y > otherObj.y && distanceX < totalWidth){
      this.isHit = true
    }else if(this.direction === DOWN && this.y < otherObj.y && distanceX < totalWidth){
      this.isHit = true
    }else if(this.direction === RIGHT && this.x < otherObj.x && distanceY < totalHeight){
      this.isHit = true
    }else if(this.direction === LEFT && this.x > otherObj.x && distanceY < totalHeight){
      this.isHit = true
    }else{
      this.isHit = false
    }
  }

  // 呆在原地，并且轮子不转
  stay(){
    if(this.active){
      this.setVelocity(0, 0)
      this.playAnimation('stay')
    }
  }

  // 禁止移动
  disableMove(){
    if(this.active){
      console.log('disable move')
      this.stay()
      this.isMovable = false
    }
  }

  // 取消禁止移动
  enableMove(){
    if(this.active){
      console.log('enable move')
      this.isMovable = true
    }
  }

  playAnimation(type){
    this.anims.play(`${this.name}-${this.grade}${this.haveProp?'-prop':''}-${type}`, true)
  }
  
  // 发射子弹
  shoot(){
    if(!this.active) return;

    if(!this.isMovable) return;

    // 如果坦克已经发射了子弹，则不能继续发射
    if(this.shootTimes >= this.bulletNum) return;

    if(this.name.indexOf('player') > -1){
      this.playSound('playerShoot')
    }
    
    // 设置子弹的坐标
    let x = this.x;
    let y = this.y;

    switch(this.direction){
      case UP: y -= this.displayHeight / 2; break;
      case DOWN: y += this.displayHeight / 2; break;
      case RIGHT: x += this.displayWidth / 2; break;
      case LEFT: x -= this.displayWidth / 2; break;
    }

    this.scene.bulletGroup.createBullet(this, x, y, this.bulletSpeed)

    this.shootTimes += 1
  }

  // 自动移动
  AIMove(duration = 2000){
    if(this.isAI) {
      this.aiMoveTimer = setInterval(() => {
        if(this.active){
          const random = Phaser.Math.Between(0, 3)
          this.move(random)
        }
      }, duration)
    }
  }

  // 自动发射子弹
  AIShoot(duration = 3000){
    if(this.isAI){
      this.aiShootTimer = setInterval(() => {
        if(this.active){
          this.shoot()
        }
      }, duration)
    }
  }

  // 生成保护罩
  createShield(){
    if(!this.shield){
      this.shield = this.scene.physics.add.sprite(this.x, this.y, 'shield')
      this.shield.setDepth(this.depth + 1)
    }else{
      this.shield.enableBody(true, this.x0, this.y0, true, true)
    }
    
    this.shield.play('shield', true)

    clearTimeout(this.shieldTimer)
    this.shieldTimer = setTimeout(() => {
      this.isProtected = false
      this.shield.disableBody(true, true)
    }, this.shieldTime)
  }
  
  // 坦克被击中
  isShooted(){
    console.log('base isShooted')
  }

  // 坦克毁灭
  crash(isPlayCrashSound = true, cb) {
    // 先将坦克隐藏，显示坦克爆炸动画，播放爆炸声音
    this.disableBody(true, true)

    if(isPlayCrashSound){
      this.playSound(this.crashSound)
    }

    const explode = this.scene.physics.add.sprite(this.x, this.y, 'tankExplode')
    explode.setScale(1.2)
    explode.anims.play('tank-explode')
    
    // 动画爆炸结束后，销毁坦克实例，销毁爆炸实例，
    explode.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      explode.destroy(true)

      if(!this.active){
        clearInterval(this.aiMoveTimer)
        clearInterval(this.aiShootTimer)
      }
      cb && cb()
    }, this.scene)
  }


  // 播放音效
  playSound(soundName, loop = false){
    if(soundName){
      this.scene.sound.play(soundName, {loop})
    }
  }
}

/**
 * 菜单坦克
 */
class MenuTank extends Tank {
  constructor(scene, x, y, key, frame, distance, onSelectPlayers){
    super(scene, x, y, key, frame)

    this.moveDistance = distance
    this.selectedNum = 1
    this.onSelectPlayers = onSelectPlayers

    this.onKeyboard()
  }

  preUpdate(time, delta){
    super.preUpdate(time, delta)

  }

  // 菜单坦克只能上下移动
  move(){
    this.selectedNum = this.selectedNum % 2 + 1
    const y = this.y + this.moveDistance * (this.selectedNum - 1 )
    this.setPosition(this.x, y)
  }

  onKeyboard(){
    this.scene.input.keyboard.on("keydown-UP",() => {
      this.move()
    },this.scene)

    this.scene.input.keyboard.on("keydown-DOWN",() => {
      this.move()
    },this.scene)

    // 空格键确定选择
    this.scene.input.keyboard.on("keydown-SPACE",() => {
      this.onSelectPlayers && this.onSelectPlayers({playerNum: this.selectedNum})
    },this.scene)
  }
}

/**
 * 玩家坦克
 */
class Player extends Tank {
  constructor({scene, x, y, key, frame, name, grade = 1, haveProp = false, moveSpeed, bulletNum, bulletSpeed, direction}){
    super({scene, x, y, key, frame, name, grade, haveProp, moveSpeed, bulletNum, bulletSpeed, direction})

    this.isProtected = false
    this.lives = 3
  }

  // 被击中
  isShooted(){
    if(this.isProtected) return

    if(this.grade > 1){  
      this.grade = 1
      this.setGrade(this.grade)
      this.playAnimation('stay')
    }else if(this.lives > 1){
      this.lives -= 1
      this.crash(true, ()=>{
        this.reborn()
      })
    }else if(this.lives === 1){
      this.crash()
    }
    
    this.sendMsg()
  }

  // 设置当前生命值
  setLives(lives){
    this.lives = lives
  }

  // 坦克升级
  setGrade(grade){
    if(grade <= 4){
      this.grade = grade

      const { moveSpeed, bulletNum, bulletSpeed } = this.scene.playerGroup.tankTypes[this.name][this.grade - 1]
      this.moveSpeed = moveSpeed
      this.bulletNum = bulletNum
      this.bulletSpeed = bulletSpeed
    }
  }

  // 重新复活
  reborn(){
    this.enableBody(true, this.x0, this.y0, true, true)
    this.setDirection(this.direction0)
    this.setGrade(1)
    this.isProtected = true
  }

  //发送信息
  sendMsg(){
    
    const {name, lives, grade} = this
    const flag = this.emit('playerchange', { name, lives, grade, alive: this.active })
    console.log('发送消息', flag, {name, lives, grade, })
  }
}

/**
 * 敌方坦克
 */
 class Enemy extends Tank {
  constructor({scene, x, y, key, frame, name, grade, haveProp, moveSpeed, bulletNum, bulletSpeed, direction}){
    super({scene, x, y, key, frame, name, grade, haveProp, moveSpeed, bulletNum, bulletSpeed, direction})

    this.isAI = true

    this.setDirection(this.direction)
    this.AIMove(3000)
    this.AIShoot(2000)

    this.bore()
  }

  isShooted(){
    // 保护期内的坦克免受伤害
    if(this.isProtected) return

    // 带有奖品的坦克被攻击后，会生成奖品
    if(this.haveProp){
      this.haveProp = false
      this.playAnimation('stay')
      this.playSound('bulletCrack')

      
      this.scene.propsGroup.createProp()
      return
    }

    // 一级的坦克直接爆炸，高级的坦克需要降级
    if(this.grade === 1){
      this.crash()
      
    }else {
      this.grade -= 1
      this.playSound('bulletCrack')
      this.playAnimation('stay')
    }
  }

  bore(){
    this.disableBody(true, true)

    // 创建敌方坦克之前，先显示出生的星
    const bore = this.scene.physics.add.sprite(this.x, this.y, 'enemy-bore', 0)
    bore.setDepth(2)
    bore.anims.play('enemy-bore')

    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        bore.destroy(true)
        
        this.enableBody(true, this.x0, this.y0, true, true)
        
      },
      callbackScope: this.scene
    })
  }
}

export {
  Player,
  Enemy,
  MenuTank
}