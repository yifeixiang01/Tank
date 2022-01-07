
class Tank{
  constructor(){
    this.container = new Container()
    this.x = 0;
    this.y = 0;
    this.type = 0;   //坦克类型 1 玩家 2 敌方
    this.size = 32;  //坦克的大小
    this.dir = UP;  //方向0：上 1：下 2：左 3：右
    this.speed = 1;  //坦克的速度
    this.frame = 0;  //控制地方坦克切换方向的时间
    this.hit = false;  //是否碰到墙或者坦克
    this.isAI = false; //是否自动
    this.isShooting = false;  //子弹是否在运行中
    this.bullet = null;  //子弹
    this.shootRate = 0.6;  //射击的概率
    this.isDestroyed = false; 
    this.tempX = 0;
    this.tempY = 0;
  }

  /**
   * 碰撞检测
   * */ 
  isHit(){
    if(this.dir == LEFT){
      if(this.x <= map.offsetX + this.size / 2){
        this.x = map.offsetX + this.size / 2
        this.hit = true
      }
    }else if(this.dir == RIGHT){
      if(this.x >= map.offsetX + map.mapWidth - this.size / 2){
        this.x = map.offsetX + map.mapWidth - this.size / 2
        this.hit = true
      }
    }else if(this.dir == UP){
      if(this.y <= map.offsetY + this.size / 2){
        this.y = map.offsetY + this.size / 2
        this.hit = true
      }
    }else if(this.dir == DOWN){
      if(this.y >= map.offsetY + map.mapHeight - this.size / 2){
        this.y = map.offsetY + map.mapHeight - this.size / 2
        this.hit = true
      }
    }
    this.container.position.set(this.x, this.y)
    if(!this.hit){
      if(tankMapCollision(this, map)){
        this.hit = true
      }
    }
  }

  shoot(){
    // if(this.isAI && emenyStopTime > 0){
    //   return;
    // }
    if(this.isShooting){
      return;
    }else{
      this.bullet = new Bullet(this, this.type, this.dir)
      app.stage.addChild(this.bullet.container)

      // if(!this.isAI){
      //   ATTACK_AUDIO.play()
      // }
      
      this.isShooting = true
    }
  }

  destroy(){
    this.isDestroyed = true;
    // crackArray.push(new CrackAnimation(crack_TYPE_TANK, this.ctx, this))
    // TANK_DESTROY_AUDIO.play();
  }
}


/**
 * 菜单选择坦克
 * */ 
class SelectTank extends Tank {
  constructor(){
    super()
    this.ys = [250, 281]
    this.x = 140
    this.y = this.ys[0]
    this.size = 27
  }
  init(texture){
    let selectTankSprite = Sprite.from(texture)
    this.container.addChild(selectTankSprite)
    this.container.x = this.x
    this.container.y = this.y
  }
  move(num){
    this.y = this.ys[num]
    this.container.y = this.y
  }
}

/**
 * 玩家坦克
 * */ 
class PlayerTank extends Tank{
  constructor(texture, x, y, dir){
    super()
    this.type = 1     //坦克类型 1 玩家 2 敌方
    this.lives = 3;   //玩家生命值
    this.isProtected = true; //是否受保护
    this.protectedTime = 500;
    this.offsetX = 0; //坦克2与坦克1的距离
    this.speed = 4;
    this.x = x + this.size / 2
    this.y = y + this.size / 2
    this.dir = dir

    this.init(texture)
  }

  init(texture){
    this.hit = false;

    let rect = new Graphics()
    rect.beginFill(0xCC3333)
    rect.drawRect(-this.size / 2, -this.size/2, this.size, this.size)
    rect.endFill();
    this.container.addChild(rect)
    this.container.width = this.container.height = this.size;
    let player = Sprite.from(texture)
    // player.tint = 0xFF9933
    player.anchor.set(0.5, 0.5)
    this.container.addChild(player)

    this.container.position.set(this.x, this.y)
    this.container.rotation = Math.PI * this.dir / 2

    if(this.isProtected){
      var temp = parseInt((500 - this.protectedTime) / 5) % 2;
      
    }
  }

  destroy(){
    this.isDestroyed = true;
  }
  move(dir){
    this.dir = dir
    this.container.rotation = Math.PI * dir / 2
    switch(dir){
      case UP: {
        this.container.y = this.y -= this.speed;
        break;
      }
      case RIGHT: {
        this.container.x = this.x += this.speed;
        break;
      }
      case DOWN: {
        this.container.y = this.y += this.speed;
        break;
      }
      case LEFT: {
        this.container.x = this.x -= this.speed;
        break;
      }
    }
  }
}

/**
 * 敌方坦克
 * */ 
class EnemyTank extends Tank{
  constructor(texture, x, y, dir){
    super()
    this.type = 2   //坦克类型 1 玩家 2 敌方
    this.isAppear = true;
    this.times = 0;
    this.lives = 1;
    this.isAI = true;
    this.speed = 1.5;
    this.dir = dir
    this.x = x
    this.y = y

    this.init(texture)
  }

  init(texture){
    this.container.x = this.x
    this.container.y = this.y

    
    if(!this.isAppear){
      let temp = parseInt(this.times / 5) % 7;
      
    }else {
      let enemyTankSprite = Sprite.from(texture)
      enemyTankSprite.anchor.set(0.5, 0.5)

      this.container.rotation = Math.PI * this.dir / 2
      this.container.addChild(enemyTankSprite)

      //以一定的概率射击
      app.ticker.add(() => {
        this.times++;
        if(this.times % 50 == 0){
          var ran = Math.random();
          if(ran < this.shootRate){
            this.times = 0;
            this.shoot(2)
          }
        }
      })
      
    }
  }
  move(){
    //如果是AI坦克，在一定时间或者碰撞之后切换方法
    if(this.isAI && emenyStopTime > 0){
      return;
    }


    if(this.isAI){
      this.frame++;
      if(this.frame % 100 == 0 || this.hit){
        
        this.dir = parseInt(Math.random() * 4)
        this.container.rotation = Math.PI * this.dir / 2
        this.hit = false;
        this.frame = 0;
      }
      let tempX = this.x, tempY = this.y;
      if(this.dir == UP){
        tempY -= this.speed;
      }else if (this.dir == DOWN){
        tempY += this.speed
      }else if(this.dir == RIGHT){
        tempX += this.speed
      }else if(this.dir == LEFT){
        tempX -= this.speed;
      }
      this.isHit();
      if(!this.hit){
        this.container.x = this.x = tempX
        this.container.y = this.y = tempY
      }
    }
  }
}
