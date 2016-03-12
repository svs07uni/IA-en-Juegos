var anchoCelda = 40, altoCelda = 40;
var columnasGrilla = Math.floor(800/anchoCelda);
var filasGrilla = Math.floor(600/altoCelda);

function crearGrilla(){
   	var matriz = new Array(20);
    for (var i = 0; i < 20; i++) {
        matriz[i] = new Array(15);
    }
    return matriz;
}  
  
  
 //Agregamos los elementos en la matriz
function agregar (matriz,cantidad, grupo, claveSprite, escala) {
	escala = escala || 1;
	var indice, pos;
	for (var i=0; i < cantidad; i++) {
		var x = Math.floor(Math.random()*matriz.length);
		var y = Math.floor(Math.random()*matriz[0].length);
		while (matriz[x][y] !== undefined) {
			x = Math.floor(Math.random()*matriz.length);
			y = Math.floor(Math.random()*matriz[0].length);
		}
		pos = calcularPosicion(x,y);
		matriz[x][y] = grupo.create(pos.x,pos.y,claveSprite);
		matriz[x][y].scale = new Phaser.Point(escala,escala);
		matriz[x][y].anchor.setTo(0.5,0.5);
	}
}

//calcula la posicion del elemento dentro de la matriz
function calcularPosicion (xMatriz, yMatriz) {
	var x = xMatriz * anchoCelda;
	var y = yMatriz * altoCelda;
	return new Phaser.Point(x+Math.floor(anchoCelda*0.5),y+Math.floor(altoCelda*0.5));
}
  
    
