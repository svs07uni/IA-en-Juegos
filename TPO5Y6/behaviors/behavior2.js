Steering = function (position, orientation, velocity) {
	this.position = position || new Phaser.Point();//sprite.position
	this.orientation = orientation || 0;//sprite.rotation
	this.velocity = velocity || new Phaser.Point();//sprite.body.velocity
};

// ----------------------------------------------------------------------------
// Behaviors. -----------------------------------------------------------------
Behavior = function (character) {
	this.character = character;
};

Behavior.prototype = new Behavior();
Behavior.prototype.constructor = Behavior;

Behavior.prototype.update = function (steering) {
	this.character.body.velocity = steering.velocity;
	this.character.rotation = steering.orientation;
};

Behavior.getSteering = function (initialPoint, finalPoint, speed) {
	var steering = new Steering();
	
	steering.velocity = Phaser.Point.subtract (initialPoint, finalPoint);
	steering.velocity.normalize();
	steering.velocity.multiply (speed,speed);
	
	return steering;
};

Behavior.prototype.align = function (velocity) {
	return (velocity.getMagnitude() > 0) ? Math.atan2(velocity.x, -1*velocity.y) : this.character.rotation;
};

// Seek. ----------------------------------------------------------------------
Seek = function (character, target) {
	Behavior.call (this, character);
	this.target = target || new Steering();
};

Seek.prototype = Object.create (Behavior.prototype);
Seek.prototype.constructor = Seek;

Seek.prototype.getSteering = function () {
	var steering = Behavior.getSteering (this.target.position, this.character.position, this.character.body.maxSpeed);
	steering.orientation =  this.align (steering.velocity);
	return steering;
};


//Flee. -----------------------------------------------------------------------
Flee = function (character, target) {
	Behavior.call (this, character);
	this.target = target || new Steering();
};

Flee.prototype = Object.create (Behavior.prototype);
Flee.prototype.constructor = Flee;

Flee.prototype.getSteering = function () {
	var steering = Behavior.getSteering (this.character.position, this.target.position, this.character.body.maxSpeed);
	steering.orientation =  this.align (steering.velocity);
	return steering;	
};

// Arrive. --------------------------------------------------------------------
Arrive = function (character, target, timeToTarget) {
	Behavior.call (this, character);
	this.target = target;
	this.timeToTarget = timeToTarget || 0.5;
};

Arrive.prototype = Object.create (Behavior.prototype);
Arrive.prototype.constructor = Arrive;

Arrive.prototype.getSteering = function () {
	var steering = new Steering();
	steering.velocity = Phaser.Point.subtract (this.target.position, this.character.position);
	if (steering.velocity.getMagnitude() < this.character.satisfactionRadius) {
		steering.velocity.set(0,0);
	} 
	else {
		steering.velocity = Phaser.Point.divide (steering.velocity, new Phaser.Point (this.timeToTarget, this.timeToTarget));
		if (steering.velocity.getMagnitude() > this.character.body.maxSpeed) {
			steering.velocity.normalize();
			steering.velocity = Phaser.Point.multiply (steering.velocity, new Phaser.Point (this.character.body.maxSpeed, this.character.body.maxSpeed));
		};
	};
	steering.orientation = this.align (steering.velocity);
	return steering;
};

// Wander. --------------------------------------------------------------------
Wander = function (character, maxRotation) {
	Behavior.call (this, character);
	this.maxRotation = maxRotation || Math.PI/6;
};

Wander.prototype = Object.create (Behavior.prototype);
Wander.prototype.constructor = Wander;

Wander.prototype.getSteering = function () {
	var steering = new Steering();
	
	var orientation = this.maxRotation * (Math.random() - Math.random());	
	orientation = new Phaser.Point (Math.cos(orientation), Math.sin(orientation));
	steering.velocity = Phaser.Point.multiply (orientation, new Phaser.Point (this.character.body.maxSpeed, this.character.body.maxSpeed));
	steering.position = Phaser.Point.add(this.character.position, steering.velocity);

	steering = Behavior.getSteering (steering.position, this.character.position, this.character.body.maxSpeed);
	steering.orientation =  this.align (steering.velocity);
	return steering;
};

// Pursuit. -------------------------------------------------------------------
Pursuit = function (character, target, maxPrediction) {
	Behavior.call (this, character);
	this.target = target;
	this.maxPrediction = maxPrediction || 0.25;
};

Pursuit.prototype = Object.create (Behavior.prototype);
Pursuit.prototype.constructor = Pursuit;

Pursuit.prototype.getSteering = function () {
	var direction = Phaser.Point.subtract (this.target.position, this.character.position);
	var distance = direction.getMagnitude();
	var speed = this.character.body.velocity.getMagnitude();
	
	var prediction = (speed <= distance / this.maxPrediction) ? this.maxPrediction : distance/speed;
	prediction = Phaser.Point.multiply(this.target.body.velocity, new Phaser.Point(prediction, prediction));	
	prediction = Phaser.Point.add (this.target.position, prediction);
	
	var steering = Behavior.getSteering (prediction, this.character.position, this.character.body.maxSpeed);
	steering.orientation =  this.align (steering.velocity);
	return steering;
};

// Evade. ---------------------------------------------------------------------
Evade = function (character, target, maxPrediction) {
	Behavior.call (this, character);
	this.target = target;
	this.maxPrediction = maxPrediction || 0.25;
};

Evade.prototype = Object.create (Behavior.prototype);
Evade.prototype.constructor = Evade;

Evade.prototype.getSteering = function () {
	
	var direction = Phaser.Point.subtract (this.target.position, this.character.position);
	var distance = direction.getMagnitude();
	var speed = this.character.body.velocity.getMagnitude();
	
	var prediction = (speed <= distance / this.maxPrediction) ? this.maxPrediction : distance/speed;
	prediction = Phaser.Point.multiply(this.target.body.velocity, new Phaser.Point(prediction, prediction));	
	prediction = Phaser.Point.add(this.target.position, prediction);
	
	var steering = Behavior.getSteering (this.character.position, prediction, this.character.body.maxSpeed);
	steering.orientation =  this.align (steering.velocity);
	return steering;
};
