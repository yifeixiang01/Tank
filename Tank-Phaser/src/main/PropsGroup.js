
let clockTimer = null  // 闹钟定时器
let propsTimer = null
class PropsGroup extends Phaser.Physics.Arcade.StaticGroup {
  constructor(world, scene, mapArea){
    super(world, scene)

    this.left = mapArea.x - mapArea.width / 2
    this.right = mapArea.x + mapArea.width / 2
    this.top = mapArea.y - mapArea.height / 2
    this.bottom = mapArea.y + mapArea.height / 2
    this.offsetX = 16
    this.offsetY = 16
    this.propsNames = [ 'tank', 'clock', 'shovel', 'bomb', 'star', 'guard']
    this.currentProp = null  // 当前显示的道具
    this.clockTime = 10000    // 闹钟道具，禁止敌方坦克移动的时间  
    this.propsChangeTime = 12000  // 更换道具的时间
    this.propsScore = 500        // 每获取一次道具奖励的分数
  } 

  start(){
    this.createProp()
  }

  // 生成一个道具
  createProp(){
    // 每次界面上只能显示一个道具，有新的道具出现则需要将上一个道具销毁
    if(this.currentProp){
      this.currentProp.destroy(true)
    }
    
    // 随机生成道具索引
    const index = Phaser.Math.Between(0, 5)
    // const index = 1
    
    // 随机生成x，y坐标
    const x = Phaser.Math.Between(this.left + this.offsetX, this.right - this.offsetX)
    const y = Phaser.Math.Between(this.top + this.offsetY, this.bottom - this.offsetY)

    this.currentProp = this.scene.physics.add.staticSprite(x, y, 'Props', index)
    this.currentProp.name = this.propsNames[index]
    this.currentProp.setDepth(3)
    this.add(this.currentProp)

    // clearTimeout(propsTimer)
    // propsTimer = setTimeout(() => {
    //   this.createProp()
    // }, this.propsChangeTime)
    setTimeout(() => {
      this.currentProp.destroy(true)
    }, this.propsChangeTime)
  }

  give(player, Prop){
    switch(Prop.name){
      case 'tank': this.addPlayerLevels(player); break;
      case 'clock': this.disableAllEnemyMove(); break;
      case 'shovel': this.switchHomeBrick(); break;
      case 'bomb': this.crashAllAliveEnemy(); break;
      case 'star': this.playerUpgrade(player); break;
      case 'guard': this.protectTank(player); break;
    }
    
    // 玩家领取道具后，需要销毁道具
    Prop.destroy(true)

    // 获取到炸弹，播放敌方坦克爆炸音效，否则播放领奖音效
    if(Prop.name !== 'bomb'){
      this.playSound('getProps')
    }else{
      this.playSound('enemyCrack')
    }
  }

  // 给玩家添加生命
  addPlayerLevels(player){
    player.setLives(player.levels + 1)
  }

  // 坦克升级
  playerUpgrade(player){
    player.setGrade(player.grade + 1)
  }

  // 坦克添加防护罩
  protectTank(player){
    player.isProtected = true
  }

  // 切换老巢附近的砖块
  switchHomeBrick(){
    this.scene.mapGroup.switchHome('home-brick')
  }

  // 摧毁所有敌方活着的坦克
  crashAllAliveEnemy(){
    const enemys = this.scene.enemyGroup.getChildren()
    
    if(enemys.length > 0){
      enemys.forEach(enemy => {
        if(enemy.active){
          enemy.crash(false)
        }
      })
    }
  }

  // 禁止所有敌方坦克移动
  disableAllEnemyMove(){
    console.log('disable all')
    let enemys = this.scene.enemyGroup.getChildren()
    if(enemys.length > 0){
      enemys.forEach(enemy =>{
        if(enemy.active){
          enemy.disableMove()
        }
      })
    }

    clearTimeout(clockTimer)
    clockTimer = setTimeout(() => {
      enemys = this.scene.enemyGroup.getChildren()
      enemys.forEach(enemy =>{
        if(enemy.active){
          enemy.enableMove()
        }
      })

      clearTimeout(clockTimer)
      clockTimer = null
    }, this.clockTime)
  }

  // 播放音效
  playSound(soundName){
    if(soundName){
      this.scene.sound.play(soundName)
    }
  }
}

export default PropsGroup