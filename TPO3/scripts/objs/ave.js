function Ave(game) {
    Boid.call(this,game);
    this.colTarget = null;
    this.un_target = null;
	this.setVelocity = 200;
}

// subclass extends superclass
Ave.prototype = Object.create(Boid.prototype);
Ave.prototype.constructor = Boid;

Ave.prototype.crear = function (target) {
    this.colTarget = target;
    var pos = new Phaser.Point(game.world.width *0.5, game.world.height *0.5);
    var vel = new Phaser.Point(0, 0);
    Boid.prototype.create.call(this,pos, vel, 0, false);
    this.un_target = target.length-1;
	this.cargarArrive(this.colTarget[this.un_target]);
	this.behavior = new BehaviorArrive(this);    
    
    return this;
}
var wander=false;
Ave.prototype.update = function () {
    if(this.un_target < 0 && !wander){
		wander=true;
		this.cargarWandering();
			this.behavior = new BehaviorWander(this);
		}
		console.log("entro al update");
	this.behavior.update();
    if(this.un_target >= 0)//Existen mariposas
    	game.physics.arcade.overlap(this.sprite, this.colTarget[this.un_target].sprite, cambiarTarget, null, this); 
	
	if(this.home != null)
	   game.physics.arcade.overlap(this.sprite, this.home.sprite, anidar, null, this); 
}
var cont = 6;
function anidar(){
	if(cont > 0){
		setTimeout(crearAve, 5000);
		cont--;
	}
}
var ave;
function crearAve(){
		ave = new Boid(game);
		ave.initialize(2, 'jay');
	}

function cambiarTarget(ave, boid){
    boid.kill();//Mata la mariposa
    this.un_target--;
    if(this.un_target > 0){
        target = this.colTarget[this.un_target];
        this.updateTargetArrival(target);
    }
    else{
       target = this.colTarget[this.un_target];
	   	this.cargarPursuit.call(this,target);
	   	this.behavior = new BehaviorPursue(this);       
    	
	}
}

Ave.prototype.irCasa = function(casa){
	this.home = casa;
	this.behavior = new BehaviorFind(this,casa);
}