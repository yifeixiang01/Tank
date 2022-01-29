
class Bullet {
  constructor(owner, type, dir){
    this.container = new Container()
    this.x = 0;
    this.y = 0;
    this.owner = owner
    this.type = type; //1.玩家 2.敌方
    this.dir = dir
    this.speed = 3;
    this.size = 6
    this.hit = false;
    this.isDestroyed = false

    this.init()
  }

  init(){
    //加入子弹数组
    bulletArray.push(this)

    let bulletSprite = Sprite.from(tankTextures['bullet.png'])
    bulletSprite.anchor.set(0.5, 0.5)
    this.container.rotation = Math.PI * this.dir / 2
    this.container.addChild(bulletSprite)

    if(this.dir === UP){
      this.x = this.owner.x
      this.y = this.owner.y - this.owner.size /2 - this.size / 2
    }else if(this.dir === DOWN){
      this.x = this.owner.x
      this.y = this.owner.y + this.owner.size / 2 + this.size / 2;
    }else if(this.dir === LEFT){
      this.x = this.owner.x - this.owner.size / 2 - this.size
      this.y = this.owner.y
    }else if(this.dir === RIGHT){
      this.x = this.owner.x + this.owner.size / 2 + this.size / 2
      this.y = this.owner.y
    }
    this.container.position.set(this.x, this.y)

    let tempX = this.x
    let tempY = this.y
    app.ticker.add(() => {
      this.move(tempX, tempY)
    })
    
  }

  move(x, y){
    if(this.isDestroyed) return;

    if(this.dir === UP){
      this.y -= this.speed;
    }else if(this.dir === DOWN){
      this.y += this.speed;
    }else if(this.dir === RIGHT){
      this.x += this.speed;
    }else if(this.dir === LEFT){
      this.x -= this.speed;
    }
    this.container.position.set(this.x, this.y)

    //todo 此处完成后可删除
    if(this.x <= 0 || this.x >= 1000){
      // this.container.x = this.x = x
      this.destroy()
    }
    if(this.y <= 0 || this.y >= 1000){
      // this.container.y = this.y = y
      this.destroy()
    }
    this.isHit()
  }

  isHit(){
    if(this.isDestroyed){
      return
    }
    //临界检测
    if(this.x < this.size / 2){
      this.x = this.size / 2
      this.hit = true
    }else if(this.x > map.mapWidth - this.size / 2){
      this.x = map.mapWidth - this.size / 2
      this.hit = true
    }else if(this.y < this.size / 2){
      this.y = this.size / 2
      this.hit = true
    }else if(this.y > map.mapHeight - this.size / 2){
      this.y = map.mapHeight - this.size / 2
      this.hit = true
    }
    this.container.position.set(this.x, this.y)
    //子弹是否碰撞了其它子弹
    // if(!this.hit && bulletArray.length > 0){
    //   for(var i = 0; i < bulletArray.length; i++){
    //     if(bulletArray[i] != this && this.owner.isAI !== bulletArray[i].owner.isAI && bulletArray[i].hit == false && CheckIntersect(bulletArray[i], this, 0)){
    //       this.hit = true;
    //       bulletArray[i].hit = true
    //       break;
    //     }
    //   }
    // }

    if(!this.hit){
      //地图检测
      // if(bulletMapCollision(this, map)){
      //   this.hit = true
      // }
      //是否击中坦克
      if(this.type == BULLET_TYPE_PLAYER){
        if(enemyArray != null || enemyArray.length > 0){
          for(var i = 0; i < enemyArray.length; i++){
            var enemyObj = enemyArray[i]
            if(!enemyObj.isDestroyed && CheckIntersect(this, enemyObj, 0)){
              CheckIntersect(this, enemyObj, 0)
              if(enemyObj.lives > 1){
                enemyObj.lives--
              }else{
                enemyObj.destroy()
              }
              this.hit = true;
              break;
            }
          }
        }else if(this.type == BULLET_TYPE_ENEMY){
          if(playerArray != null || playerArray.length > 0){
            for(var i = 0; i < playerArray.length; i++){
              if(playerArray[i].lives > 0 && CheckIntersect(this, playerArray[i], 0)){
                if(!playerArray[i].isProtected && !playerArray[i].isDestroyed){
                  playerArray[i].destroy()
                }
                this.hit = true
              }
            }
          }
        }
      }
    }

    if(this.hit){
      this.destroy()
    }

  }
  // 销毁
  destroy(){
    this.isDestroyed = true;
    this.owner.isShooting = false
    this.container.destroy();

    let index = bulletArray.findIndex(bullet => bullet == this)
    bulletArray.splice(index, 1)
    
    // if(!this.owner.isAI){
    //   BULLET_DESTROY_AUDIO.play();
    // }
    new CrackAnimation(CRACK_TYPE_BULLET, this.x, this.y)
  }
}