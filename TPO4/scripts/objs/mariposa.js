function Mariposa(game) {
	Boid.call(this, game);
	
}

// subclass extends superclass
Mariposa.prototype = Object.create(Boid.prototype);
Mariposa.prototype.constructor = Boid;

Mariposa.prototype.crear = function (tipo) {
	var pos = new Phaser.Point(game.world.width * 0.5, game.world.height * 0.5);
	var vel = new Phaser.Point(0, 0);
    this.cargarWandering();
	Boid.prototype.create.call(this, pos, vel, 100, false);
	this.behavior = new BehaviorWander(this);	
}

Mariposa.prototype.update = function () {
	this.behavior.update();
}

Mariposa.prototype.cambiarFlee = function(target){
	this.cargarFlee.call(this,target);
	this.behavior = new BehaviorFlee(this);
}

Mariposa.prototype.cambiarEvade = function(target){
	this.cargarEvade.call(this,target);
	this.behavior = new BehaviorEvade(this);
}	
	
	