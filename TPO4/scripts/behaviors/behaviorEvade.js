function BehaviorEvade(boid) {
	Behavior.call(this, boid); // call super constructor.
        
}

// subclass extends superclass
BehaviorEvade.prototype = Object.create(Behavior.prototype);
BehaviorEvade.prototype.constructor = BehaviorEvade;
BehaviorEvade.prototype = {

	update:function(){
		var evadeVec = this.calcEvade();
		this.boid.sprite.body.acceleration.add(evadeVec.x,evadeVec.y);
		//MovementUtils.loopWalls(this.boid.sprite.body.position,this.boid.game.world);
		Behavior.prototype.update.call(this);
		
	},

	calcEvade:function(){
		var pursuitVec = MovementUtils.seekSteer(this.boid.sprite.position, this.boid.evadingTarget.sprite.position, this.boid.sprite.body.velocity, this.boid.maxEvadingForce, this.boid.maxEvadingSpeed);
		return pursuitVec;
	}
        
}
