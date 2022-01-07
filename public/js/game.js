let imgs = [
  {name: 'startup', url: '../images/menu.gif'},
  {name: 'tankAll', url: '../images/tank.json'}
]

let tankTextures = null
let emenyStopTime = 0;
let map = null; //地图
let bulletArray = []; //子弹数组
let keys = []; 
class Game{
  constructor(width, height){
    
    this.menu = new Menu()
    this.gameState = 1;  //游戏状态 0 未开始，1 游戏中，2 暂停中， 3 结束
    app.stage.addChild(this.menu.container)
    
    this.init()
  }
  init(){
    map = new Map(1)


    //加载资源
    loader.add(imgs).load((loader, resources) => {
      
      tankTextures = resources['tankAll'].textures
      console.log('resources', tankTextures)
      this.menu.init(resources['startup'].texture, tankTextures['tank_select.png'])
      this.menu.container.x = 700
      this.menu.container.y = 100
      
      map.init();

      let enemyTank1 = new EnemyTank(tankTextures['tank_enemy_2.png'], 150, 130, LEFT);
      let enemyTank2 = new EnemyTank(tankTextures['tank_enemy_3.png'], 200, 260, UP);
      // let enemyTank3 = new EnemyTank(tankTextures['tank_enemy_3.png'], 300, 500, UP);
      let enemyTank4 = new EnemyTank(tankTextures['tank_enemy_4.png'], 300, 300, UP);
      let enemyTank5 = new EnemyTank(tankTextures['tank_enemy_5.png'], 260, 360, UP);
      app.stage.addChild(enemyTank1.container)
      app.stage.addChild(enemyTank2.container)
      // app.stage.addChild(enemyTank3.container)
      app.stage.addChild(enemyTank4.container)
      app.stage.addChild(enemyTank5.container)

      let player = new PlayerTank(tankTextures[`tank_player_2.png`], 340, 200, UP);
      playerArray.push(player)
      app.stage.addChild(player.container)

      app.ticker.add(() => {
        enemyTank1.move()

        enemyTank2.move()

        enemyTank4.move()

        enemyTank5.move()
      })
      //监听键盘事件
      this.addKeyEventListener()

      // let bullet = new Bullet(this, 2, UP)
      // bullet.init(500, 300)
      // app.stage.addChild(bullet.container)

      // let bullet = Sprite.from(tankTextures['bullet.png'])
      //  bullet.x = 500
      //  bullet.y= 300
      // app.stage.addChild(bullet)

      new CrackAnimation();
    })
  }

  addKeyEventListener(){
    window.addEventListener('keydown', (e) =>{
      if(this.gameState == 0){
        if(e.code == 'Space'){
          // this.startGame()
        }
        if(e.code == 'ArrowUp' || e.code == 'ArrowDown'){
          this.menu.select()
        }
      }else{
        if(e.code === 'Space'){
          playerArray[0].shoot()
          console.log('shoot')
        }
        if(e.code == 'KeyS'){

          playerArray[0].move(DOWN)
        }
        if(e.code == 'KeyW'){

          playerArray[0].move(UP)
        }
        if(e.code == 'KeyA'){

          playerArray[0].move(LEFT)
        }
        if(e.code == 'KeyD'){

          playerArray[0].move(RIGHT)
        }
      }
      
    })
    window.addEventListener('keypress', (e) => {
      // console.log('keypress', e)
    })
  }

  startGame(){
    this.gameState = 1
    let num = this.menu.playerNum;
    for(let i = 0; i < num; i++){
      let player = new PlayerTank(tankTextures[`tank_player_${i + 1}.png`], 300 * (i + 1), 200);
      playerArray.push(player)
      app.stage.addChild(player.container)
    }
    this.menu.hide()
  }
}