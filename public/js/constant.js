/**
 * 静态变量
 * */ 
const SCREEN_WIDTH = 512;  //屏幕宽
const SCREEN_HEIGHT = 448; //屏高

/*****各个图块在图片中的位置*****/
const POS = new Array();
POS["selectTank"] = [128,96];
POS["stageLevel"] = [396,96];
POS["num"] = [256,96];
POS["map"] = [0,96];
POS["home"] = [256,0];
POS["score"] = [0,112];
POS["player"] = [0,0];
POS["protected"] = [160,96];
POS["enemyBefore"] = [256,32];
POS["enemy1"] = [0,32];
POS["enemy2"] = [128,32];
POS["enemy3"] = [0,64];
POS["bullet"] = [80,96];
POS["tankBomb"] = [0,160];
POS["bulletBomb"] = [320,0];
POS["over"] = [384,64];
POS["prop"] = [256,110];


/*****游戏状态*****/ 
const GAME_STATE_MENU = 0;
const GAME_STATE_INIT = 1;
const GAME_STATE_START = 2;
const GAME_STATE_OVER = 3;
const GAME_STATE_WIN = 4;

/*****地图快*****/
const WALL = 1;
const GRID = 2;
const GRASS = 3;
const WATER = 4;
const ICE = 5;
const HOME = 9;
const ANOTHERHOME = 8;

/*****坦克及子弹的四个方向*****/
const UP = 0;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 1;

/*****   *****/
const ENEMY_LOCATION = [192, 0, 384]; 

/*******子弹类型*****/
const BULLET_TYPE_PLAYER = 1;
const BULLET_TYPE_ENEMY = 2;

/*****爆炸类型*****/
const CRACK_TYPE_TANK = 'tank'
const CRACK_TYPE_BULLET = 'bullet'

//玩家坦克数组
let playerArray = []

//地方坦克数组
let enemyArray = []









