class Menu{
  constructor(){
    this.container = new Container();
    this.selectTank = null
    this.playerNum = 1
  }

  init(texture, selectTankTexture){
    console.log(texture)
    let menuSprite = Sprite.from(texture)
    this.container.addChild(menuSprite)

    this.selectTank = new SelectTank();
    this.container.addChild(this.selectTank.container)
    this.selectTank.init(selectTankTexture)
  }

  select(){
    this.playerNum = this.playerNum % 2 + 1
    this.selectTank.move(this.playerNum - 1)
    console.log(this.playerNum)
  }
  hide(){
    this.container.visible = false
    this.playerNum = 1
    this.selectTank.move(0)
  }
}