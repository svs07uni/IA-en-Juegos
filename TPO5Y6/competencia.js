var game = new Phaser.Game(800,600, Phaser.AUTO,'', {preload : preload, create:create, update:update} );

function preload() {
    game.load.image('nave1','assets/playerShip1_blue.png');
    game.load.image('nave2','assets/playerShip1_red.png');
    game.load.image('fondo','assets/darkPurple.png');
    game.load.image('energia', 'assets/powerupBlue_bolt.png');
    game.load.image('m1', 'assets/m1.png');
    game.load.image('m2', 'assets/m2.png');
    game.load.image('m3', 'assets/m3.png');
    game.load.image('m4', 'assets/m4.png');
}

var scoreTextA, scoreTextB;
var naves, nave1, nave2;
var obstaculos;
var items = [];
var matriz;


  
function create() {
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    var back = game.add.image(0,0, 'fondo');
    back.width = this.game.world.width;
    back.height= this.game.world.height;
    
    for (var i=0; i <10; i++){
        game.add.image(game.world.randomX, game.world.randomY, 'm4')
    }
    
   
    
    matriz = crearGrilla();
    initItems();
    initObstaculos();
    initNaves();
    
    scoreTextA = game.add.text(0, 0, '0/5', { fontSize: '28px', fill: '#0000FF' });
    scoreTextB = game.add.text(750, 0, '0/5', { fontSize: '28px', fill: '#FF0000' });
    this.gameOver = false;
}


function initNaves () {
    naves = game.add.group();
    naves.enableBody = true;
    
    nave1 = initNave(0,14,'nave1');
    nave2 = initNave(19,14,'nave2');
    nave1.setCamino(buscarCamino(nave1));
    nave2.setCamino(buscarCamino(nave2));
}

function initNave (xMatriz, yMatriz, claveSprite) {
    var pos = calcularPosicion(xMatriz,yMatriz);
    matriz[xMatriz][yMatriz] = new Nave(game,pos.x, pos.y, claveSprite);
    
    naves.add(matriz[xMatriz][yMatriz]);
    return matriz[xMatriz][yMatriz];
}

function initItems() {	
	items = game.add.group();
    items.enableBody = true;
    
    agregar(matriz, 5, items, 'energia');
}

function initObstaculos() {
    obstaculos = game.add.group();
    obstaculos.enableBody = true;
	
	agregar(matriz, 6, obstaculos, 'm2', 0.75);
	agregar(matriz, 8, obstaculos, 'm3');

	obstaculos.setAll('body.immovable',true);
}

function update() {
    if (!this.gameOver) {
        game.physics.arcade.overlap(naves, items, toca, null, this);
        actualizarScores();
        check();
        //game.physics.arcade.collide(naves, obstaculos);
        

    }
}

function toca (nave, item){
    items.remove(item);
    item.kill();
    nave.score += 1;
}

function check () {
    game.gameOver = items.length == 0;
    if (game.gameOver) {
        game.physics.arcade.collide(naves, obstaculos);
        game.physics.arcade.collide(nave1, nave2);
        game.physics.arcade.collide(nave2, nave1);
        
        game.add.text(70, 270, "Gana la partida la nave "+ganador(), {fontSize:'50px' , fill:'#FFFFFF' });
    }
}

function actualizarScores(){
    scoreTextA.text = nave1.score+'/5';
    scoreTextB.text = nave2.score+'/5';
}

function itemMasCercano (nave){
    var it;
    var dist2 =Number.MAX_VALUE;
    
    for(var i=0; i<items.length; i++){
        var dist = Phaser.Point.distance(nave.position, items.children[i].position);

        if(dist<dist2){
            dist2=dist;
            it = items.children[i];
            
        }
    }
    return it;
}


cursor = function () {
	return new Phaser.Point(game.input.mousePointer.clientX, game.input.mousePointer.clientY);
};

ganador = function () {
    return nave1.score > nave2.score ? "Azul" : "Roja";
}