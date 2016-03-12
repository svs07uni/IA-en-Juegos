function FollowerLeaderBoid(game, target) {
    Entity.call(this, game); // call super constructor.

	this.formacion = null;//Sin formacion inicial
	 // Behavior Objects
    this.leader = target;
    

    //Separacion
    this.separationRadius = 90;
    this.maxSeparation = 50;

    //Arrive
    this.leaderSightRadius = 40;//radio de evasion
    this.leaderBehindDist = 70;//distancia detras del lider

    //Evasion
    this.evadingPredict = 10;
    this.maxEvadingSpeed = 200;
    this.maxEvadingForce = 50;

    
    this.maxSpeed = 200;
    this.minSpeed = 30;
    this.maxForce = 10;
    this.maxAvoid = 3;
    this.maxSeeAhead = 100;
    this.debugAheadCatch = null;
    this.debugVel = null;
    this.debugLooK = null;
}

FollowerLeaderBoid.prototype.cambiarLeader = function (target) {
    this.leader = target;
}

// subclass extends superclass
FollowerLeaderBoid.prototype = Object.create(Entity.prototype);
FollowerLeaderBoid.prototype.constructor = FollowerLeaderBoid;


FollowerLeaderBoid.prototype.create = function (pos, vel, angle, debug) {

    Entity.prototype.create.call(this, pos, vel, angle, debug);
    if (debug)
    {
        this.debugVel = new Phaser.Line(0, 0, 0, 0);
        this.debugLooK = new Phaser.Line(0, 0, 0, 0);
    }

    return this;
}

FollowerLeaderBoid.prototype.setVelocity = function (vel) {
    this.maxSpeed = vel;
}

FollowerLeaderBoid.prototype.cambiarFormacion = function(form){
	this.formacion = form;
}

//----------------DEBUG-------------------------------

FollowerLeaderBoid.prototype.debugUpdate = function () {

    Entity.prototype.debugUpdate.call(this);
    this.debugVel.start.x = this.sprite.position.x;
    this.debugVel.start.y = this.sprite.position.y;
    this.debugVel.end.x = this.sprite.position.x + this.sprite.body.velocity.x;
    this.debugVel.end.y = this.sprite.position.y + this.sprite.body.velocity.y;

    //this.debugLooK.start.x = this.sprite.position.x;
    //this.debugLooK.start.y = this.sprite.position.y;
    //this.debugLooK.end.x =  this.debugAheadCatch.x;
    //this.debugLooK.end.y = this.debugAheadCatch.y;

}

FollowerLeaderBoid.prototype.debugRender = function () {

    Entity.prototype.debugRender.call(this);

    this.game.debug.geom(this.debugVel, 'red', true);
}

