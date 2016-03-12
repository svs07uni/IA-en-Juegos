function BehaviorFollowingLeader(boid) {
    Behavior.call(this, boid);
}

// subclass extends superclass
BehaviorFollowingLeader.prototype = Object.create(Behavior.prototype);
BehaviorFollowingLeader.prototype.constructor = BehaviorFollowingLeader;
BehaviorFollowingLeader.prototype = {
    update: function (col) {
        var tv = new Phaser.Point(this.boid.leader.sprite.body.velocity.x, this.boid.leader.sprite.body.velocity.y);

        tv.normalize();
		tv.x *= this.boid.leaderBehindDist;
        tv.y *= this.boid.leaderBehindDist;
		 // Calculate the ahead point 
        var ahead = Phaser.Point.add(this.boid.leader.sprite.position, tv);
		
		switch(this.boid.formacion){
			case 'Fila': tv = this.formacionFila(tv, col);
						break;
			case 'Columna': 
						tv.x *= -1;
        				tv.y *= -1;
						tv = this.formacionColumna(tv, col);
						break;
			case 'Wedge': tv = this.formacionWedge(tv, col);
						break;
			case 'FlancoIzquierdo': tv = this.formacionFlancoIzquierdo(tv);
						break;
			case 'FlancoDerecho': tv = this.formacionFlancoDerecho(tv);
						break;
			default: // Calculate the behind point
       				 tv.x *= -1;
        			tv.y *= -1;
					break;
		}               
        
        var behind = new Phaser.Point(this.boid.leader.sprite.position.x, this.boid.leader.sprite.position.y);
        behind = Phaser.Point.add(behind, tv);
        var arriveVec = this.calcArrive(behind);
        this.boid.sprite.body.acceleration.add(arriveVec.x, arriveVec.y);
        // If the character is on the leader's sight, add a force
        // to evade the route immediately. 
        if (isOnLeaderSight(this.boid, ahead)) {
            var evadeVec = this.calcEvade(ahead);
            this.boid.sprite.body.acceleration.add(evadeVec.x,evadeVec.y);
        }

        var sepVec = this.calcSeparation(col);
        this.boid.sprite.body.acceleration.add(sepVec.x, sepVec.y);

        Behavior.prototype.update.call(this);

    },
    calcArrive: function (behind) {
        var seek = MovementUtils.seek(behind, this.boid.sprite.position).normalize();
        var distance = Phaser.Math.distance(this.boid.sprite.position.x, this.boid.sprite.position.y, behind.x, behind.y);
        var desired;
        if (distance <= this.boid.arrivalZone)
        {
            desired = new Phaser.Point(seek.x * this.boid.maxSpeed * (distance / this.boid.arrivalZone), seek.y * this.boid.maxSpeed * (distance / this.boid.arrivalZone));

        }
        else
        {
            desired = new Phaser.Point(seek.x * this.boid.maxSpeed, seek.y * this.boid.maxSpeed);
        }

        return MovementUtils.limit(Phaser.Point.subtract(desired, this.boid.sprite.body.velocity), this.boid.maxForce);

    },
    calcEvade: function (ahead) {
        // var flee = MovementUtils.flee(ahead, this.boid.sprite.position).normalize();
        //var desired = new Phaser.Point(flee.x * this.boid.maxEvadingSpeed, flee.y * this.boid.maxEvadingSpeed);
        //var steer = MovementUtils.limit(Phaser.Point.subtract(desired, this.boid.sprite.body.velocity), this.boid.maxEvadingForce);
		var evadeVec = MovementUtils.fleeSteer(ahead, this.boid.sprite.position, this.boid.sprite.body.velocity, this.boid.maxEvadingForce, this.boid.maxEvadingSpeed);
        return evadeVec;
    },
    calcSeparation: function (col) {
        var force = new Phaser.Point(0, 0);
        var cantVecinos = 0;
        for (var i = 0; i < col.length; i++) {
            if (this.boid.sprite != col[i].sprite) {
                var distance = Phaser.Point.distance(this.boid.sprite.position, col[i].sprite.position);
                if (distance < this.boid.separationRadius) {
                    var diff = Phaser.Point.subtract(col[i].sprite.position, this.boid.sprite.position);
                    force = Phaser.Point.add(force, diff);
                    cantVecinos++;
                }
            }
        }
        if (cantVecinos > 0) {
            force.x /= cantVecinos;
            force.y /= cantVecinos;

            force.x *= -1;
            force.y *= -1;
            force.normalize();

            force.x *= this.boid.maxSeparation;
            force.y *= this.boid.maxSeparation;

            force = MovementUtils.limit(force, this.boid.maxForce);

        }

        return force;

    },
	formacionFila: function(tv, col){
		if(this.boid.sprite.id < col.length/2){
				Phaser.Point.rotate(tv, 0, 0 , 90, true);
			}
		else{
				Phaser.Point.rotate(tv, 0, 0 , -90, true);
			}
		if(col.length > 0 ){
			if(col.length % 2 != 0){//cantidad impar
				if(this.boid.sprite.id == col.length){
					tv.x *= (Math.floor(col.length/2) + 1);
       				 tv.y *= (Math.floor(col.length/2) + 1);
					 return tv;
				}
			}
			tv.x *= ((this.boid.sprite.id % Math.floor(col.length/2)) + 1);
        	tv.y *= ((this.boid.sprite.id % Math.floor(col.length/2)) + 1);
			
		}
		return tv;
	},
	formacionColumna: function(tv, col){
		tv.x *= this.boid.sprite.id;
        tv.y *= this.boid.sprite.id;
		
		return tv;
	},
	formacionFlancoIzquierdo: function(tv){
		var invertido = new Phaser.Point(tv.x * -1, tv.y * -1);
		var izquierdo = Phaser.Point.rotate(tv, 0, 0 , 90, true);
		var distancia = Phaser.Point.subtract(invertido, izquierdo);
		
		distancia.x *= this.boid.sprite.id;
        distancia.y *= this.boid.sprite.id;
		
		return distancia;
	},
	formacionFlancoDerecho: function(tv){
		var invertido = new Phaser.Point(tv.x * -1, tv.y * -1);
		var derecho = Phaser.Point.rotate(tv, 0, 0 , -90, true);
		var distancia = Phaser.Point.subtract(invertido, derecho);
		
		distancia.x *= this.boid.sprite.id;
        distancia.y *= this.boid.sprite.id;
		
		return distancia;
	},
	formacionWedge: function(tv, col){
		var invertido = new Phaser.Point(tv.x * -1, tv.y * -1);
		var distancia;
		if(this.boid.sprite.id < col.length/2){				
			var izquierdo = Phaser.Point.rotate(tv, 0, 0 , 90, true);
			distancia = Phaser.Point.subtract(invertido, izquierdo);
			}
		else{
				var derecho = Phaser.Point.rotate(tv, 0, 0 , -90, true);
				distancia = Phaser.Point.subtract(invertido, derecho);
			}
		if(col.length == 1){
			distancia.x *= this.boid.leaderBehindDist;
        	distancia.y *= this.boid.leaderBehindDist;
		}
		else{
			if(col.length % 2 != 0){//cantidad impar
				if(this.boid.sprite.id == col.length){
					distancia.x *= (Math.floor(col.length/2) + 1);
       				 distancia.y *= (Math.floor(col.length/2) + 1);
					 return distancia;
				}
			}
			distancia.x *= ((this.boid.sprite.id % Math.floor(col.length/2)) + 1);
        	distancia.y *= ((this.boid.sprite.id % Math.floor(col.length/2)) + 1);
			
		}
		return distancia;
	}

}

function isOnLeaderSight(boid, ahead) {
    var d1 = Phaser.Point.distance(ahead, boid.sprite.position);
    var d2 = Phaser.Point.distance(boid.leader.sprite.position, boid.sprite.position);

    return d1 <= boid.leaderSightRadius
            || d2 <= boid.leaderSightRadius;
}
