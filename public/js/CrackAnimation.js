
class CrackAnimation{
  constructor(type, crackObj, x, y){
    this.container = new Container();
    this.times = 0;
    this.frame = 0
    this.x = x;
    this.y = y;
    this.posName = ""
    this.size = 0;
    this.isOver = false;
    this.tempDir = 1;
    this.owner = crackObj

    if(type === CRACK_TYPE_TANK){
      this.posName = 'tankBomb'
      this.size = 66;
      this.frame = 4;
    }else{
      this.posName = "bulletBomb"
      this.size = 32;
      this.frame = 3;
    }
    // this.x = crackObj.x
    // this.y = crackObj.y

    this.init()
  }
  init(){
    let animatedSprite = new AnimatedSprite([tankTextures['destroy_small_1.png'], tankTextures['destroy_small_2.png'], tankTextures['destroy_small_3.png']])
    animatedSprite.animationSpeed = 0.1
    animatedSprite.anchor.set(0.5, 0.5)
    animatedSprite.play()
    animatedSprite.loop = false
    this.container.addChild(animatedSprite)
    this.container.position.set(this.x, this.y)
    app.stage.addChild(this.container)
    animatedSprite.onComplete = () => {
      console.log('animate complete')

      this.container.destroy();
    }
  }
}