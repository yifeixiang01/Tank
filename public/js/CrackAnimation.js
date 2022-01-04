class CrackAnimation{
  constructor(type, crackObj){
    this.container = new this.container()
    this.times = 0;
    this.frame = 0
    this.x = 0;
    this.y = 0;
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
    this.x = crackObj.x
    this.y = crackObj.y
  }
  init(){
    let gapTime = 3;
    let temp = parseInt(this.times / gapTime)
    
  }
}