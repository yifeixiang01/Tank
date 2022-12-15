
const UP = 0
const RIGHT = 1
const DOWN = 2
const LEFT = 3

class BulletGroup extends Phaser.Physics.Arcade.Group {
  constructor(world, scene){
    super(world, scene)
    this.bulletDepth = 2

    this.createAnimation()

  }

  // 生成子弹
  createBullet(owner, x, y, speed){
    const bullet = new Bullet(this.scene, owner, x, y, speed)
    bullet.setSize(12, 12)
    bullet.setDepth(this.bulletDepth)
    this.add(bullet)
    bullet.move()
  }

  // 创建爆炸动画
  createAnimation(){
    this.scene.anims.create({
      key: 'bullet-explode',
      frames: this.scene.anims.generateFrameNumbers('bulletExplode', {start: 0, end: 2}),
      frameRate: 12,
      repeat: 0
    })
  }
}


// 子弹
class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, owner, x, y, speed = 300){
    super(scene, x, y, 'bullet')

    this.name = 'bullet'
    this.owner = owner   
    this.direction = owner.direction // 子弹的方向和坦克的方向保持一致
    this.moveSpeed = speed  // 子弹飞行速度

    // 添加到场景中
    scene.add.existing(this)
    // 添加到物理系统中
    scene.physics.add.existing(this)

    // this.setCollideWorldBounds(true)
    this.setDirection()
    this.setDepth(owner.depth + 1)
    
  }
  
  // 设置子弹方向
  setDirection(){
    this.setRotation(Math.PI / 2 * this.direction)
  }
  
  // 子弹飞行
  move(){
    switch(this.direction){
      case LEFT: this.setVelocity(-this.moveSpeed, 0); break;
      case UP: this.setVelocity(0, -this.moveSpeed); break;
      case RIGHT: this.setVelocity(this.moveSpeed, 0); break;
      case DOWN: this.setVelocity(0, this.moveSpeed); break;
      default: break;
    }
  }

  // 子弹销毁
  crash(){
    if(this.active){
      this.owner.shootTimes -= 1
      this.disableBody(true, true)

      this.explode()
    }
  }

  // 子弹爆炸
  explode(){
    let x = this.x;
    let y = this.y;

    switch(this.direction){
      case UP: y -= this.displayHeight / 2; break;
      case DOWN: y += this.displayHeight / 2; break;
      case RIGHT: x += this.displayWidth / 2; break;
      case LEFT: x -= this.displayWidth / 2; break;
    }

    const explode = this.scene.physics.add.sprite(x, y, 'bulletExplode')
    explode.setDepth(this.owner.depth + 1)
    explode.anims.play('bullet-explode')

    // 动画爆炸结束后，销毁坦克实例，销毁爆炸实例，
    explode.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      explode.destroy(true)

      this.destroy(true)
    }, this.scene)
  }

  // 播放音效
  playSound(soundName){
    if(soundName){
      this.scene.sound.play(soundName)
    }
  }
}

export default BulletGroup