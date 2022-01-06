
class CrackAnimation{
  constructor(type, x, y){
    this.container = new Container();
    this.x = x;
    this.y = y;

    

    this.init(type)
  }
  init(type){
    let spriteArr = type === CRACK_TYPE_TANK? [tankTextures['destroy_small_1.png'], tankTextures['destroy_small_2.png'], tankTextures['destroy_small_3.png']]: [tankTextures['destroy_small_1.png'], tankTextures['destroy_small_2.png'], tankTextures['destroy_small_3.png']]
    let animatedSprite = new AnimatedSprite(spriteArr)
    animatedSprite.animationSpeed = 0.1
    animatedSprite.anchor.set(0.5, 0.5)
    animatedSprite.play()
    animatedSprite.loop = false
    this.container.addChild(animatedSprite)
    this.container.position.set(this.x, this.y)
    app.stage.addChild(this.container)
    animatedSprite.onComplete = () => {
      this.container.destroy();
    }
  }
}