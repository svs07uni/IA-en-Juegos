//this.meta tiene el nodo final

function posMatriz(posx, posy){
	return {x:Math.floor(posx/anchoCelda), y:Math.floor(posy/altoCelda)};
}

function enMundo(mundoRevisado,celda){
	var celdaM;
	for(i=0; i<mundoRevisado.length; i++){
		celdaM = mundoRevisado[i];
		if(celdaM.x == celda.x && celdaM.y == celda.y)
			return celdaM;
	}
//si no fue revisado aun busco en matriz
//var objeto = matriz[celda.x][celda.y];
//console.log("objeto=");
//console.log(objeto);
/*if(objeto != undefined){
	if(objeto.key=='m4'){
		celda.obstaculo = true;
		celda.clausurado = true;
	}
}*/
return celda;
}

function armarCamino(celda){
	console.log("lacelda final esssss ");
	console.log(celda);
	var camino = [];
	camino.push(celda);
	while(celda.padre != null){
		celda = celda.padre;
		camino.push(celda);
	}
	camino.reverse();
	console.log("el camino final esssss ");
	for(i=0;i<camino.length;i++)
		console.log(camino[i]);
	return camino;
}

function obtenerVecinos(celda,mundoRevisado){
	var vecinos = [];
	if(celda.x-1 >= 0){
		vecinos.push(enMundo(mundoRevisado,{x:celda.x-1,y:celda.y}));
	}
	if(celda.x+1 < columnasGrilla){
		vecinos.push(enMundo(mundoRevisado,{x:celda.x+1,y:celda.y}));
	}
	if(celda.y+1 < filasGrilla){
		vecinos.push(enMundo(mundoRevisado,{x:celda.x,y:celda.y+1}));
	}
	if(celda.y-1 >= 0){
		vecinos.push(enMundo(mundoRevisado,{x:celda.x,y:celda.y-1}));
	}

	if(celda.x-1 >= 0){
		if(celda.y+1 < filasGrilla){
			vecinos.push(enMundo(mundoRevisado,{x:celda.x-1,y:celda.y+1}));
		}
		if(celda.y-1 >= 0){
			vecinos.push(enMundo(mundoRevisado,{x:celda.x-1,y:celda.y-1}));
		}
	}
	if(celda.x+1 < columnasGrilla){
		if(celda.y+1 < filasGrilla){
			vecinos.push(enMundo(mundoRevisado,{x:celda.x+1,y:celda.y+1}));
		}
		if(celda.y-1 >= 0){
			vecinos.push(enMundo(mundoRevisado,{x:celda.x+1,y:celda.y-1}));
		}
	}
	return vecinos;
}

function actualizarQueue(revisados, item){
	var temp = new PriorityQueue(function(a,b){return b.f-a.f;}), elem;
	while(!revisados.isEmpty){
		elem = revisados.deq();
		if(item.x != elem.x || item.y != elem.y)
			temp.enq(elem);
	}
	console.log("temp= ");
	console.log(temp);
	temp.enq(item);
	revisados = temp;
  }

function heuristica(dx,dy){
	var F = Math.SQRT2 - 1;
      return (dx < dy) ? F * dx + dy : F * dy + dx;
}

function buscarCamino(nave){
	var revisados = new PriorityQueue(function(a,b){return b.f-a.f;});
	var mundoRevisado = [];
	var celdaInicio = posMatriz(nave.position.x,nave.position.y);
	console.log("celdaInicio:");
	console.log(celdaInicio);
	var celdaFin = posMatriz(nave.meta.position.x, nave.position.y);
	console.log("celdaFin:");
	console.log(celdaFin);
	var SQRT2 = Math.SQRT2;

	celdaInicio.g = 0;
	celdaInicio.f = 0;

	revisados.enq(celdaInicio);


	celdaInicio.revisado = true;
	//console.log(revisados);
	//console.log(vecino);
	while(!revisados.isEmpty()){
		console.log("revisados:");
		console.log(revisados);
		celda = revisados.deq();
		console.log("celda:");
		console.log(celda);
		celda.clausurado = true;
		mundoRevisado.push(celda);

		if(celda.x == celdaFin.x && celda.y == celdaFin.y){
						return armarCamino(celda);
					}

		vecinos = obtenerVecinos(celda,mundoRevisado);//arreglo de pares
		//console.log("vecinos:");
		//console.log(vecinos);
		for(i=0; i<vecinos.length; i++){
			vecino = vecinos[i];
			console.log("vecino :"+i);
			console.log(vecino);
			if(vecino.clausurado){
				continue;
			}

			x = vecino.x;
			y = vecino.y;
			ng = celda.g + ((x - celda.x == 0 || y - celda.y == 0)? 1: SQRT2);//calculando g
			if(!vecino.revisado || ng<vecino.g){
				vecino.g = ng;
				vecino.h = vecino.h ||  heuristica(Math.abs(x- celdaInicio.x),Math.abs(y-celdaInicio.y));

				vecino.f = vecino.g + vecino.h;
				vecino.padre = celda;

				if(vecino.x == celdaFin.x && vecino.y == celdaFin.y){
						return armarCamino(vecino);
					}

				if(!vecino.revisado){
					
					revisados.enq(vecino);
					mundoRevisado.push(vecino);
					vecino.revisado = true;
				}
				else{
					actualizarQueue(revisados,vecino);
					//revisados.enq(vecino);
				}
			}
		}
	}
	console.log("no se consiguio camino");
return [];//No se consiguió camino

}
