function Ave(game) {
    Boid.call(this,game);
    this.colTarget = null;
    this.un_target = null;
	this.setVelocity = 500;
}

// subclass extends superclass
Ave.prototype = Object.create(Boid.prototype);
Ave.prototype.constructor = Boid;

Ave.prototype.crear = function (target) {
    this.colTarget = target;
    var pos = new Phaser.Point(50, 50);
    var vel = new Phaser.Point(20, 0);
    Boid.prototype.create.call(this,pos, vel, 0, false);
    this.un_target = target.length-1;
	this.cargarArrive(this.colTarget[this.un_target]);
	this.behavior = new BehaviorArrive(this);    
    this.wander = false;
	
    return this;
}
Ave.prototype.update = function () {
    if(this.un_target < 0 && !this.wander){
		this.wander=true;
		this.cargarWandering();
			this.behavior = new BehaviorWander(this);
		}
		
	this.behavior.update();
    if(this.un_target >= 0)//Existen mariposas
    	game.physics.arcade.overlap(this.sprite, this.colTarget[this.un_target].sprite, cambiarTarget, null, this); 
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