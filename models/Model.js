import webglObjLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import { vec3 } from '../lib/threeD.js';
import {Transform} from "../lib/transform.js"
import { Arrow } from './Arrow.js';

export class Model{
	constructor(color,modelText,initialFieldPosition,id){
		this.mesh=new webglObjLoader.Mesh(modelText);
		this.vertices=this.mesh.vertices;
		this.indices=this.mesh.indices;
		this.vertexNormals=this.mesh.vertexNormals;

		this.type="Model";
		this.transform = new Transform();
		this.normalColor=color;
		this.selectedColor=[0.1,0.5,0.5,0.5];
		this.color=color;
		this.position=initialFieldPosition;
		this.transform.setEye(this.position[0],this.position[1],this.position[2]+1.5);
		this.transform.setCenter(0,0,this.position[2]+1.5);
		this.arrows=[new Arrow(color,initialFieldPosition)];
		this.id=id;
		this.light=[0,0,-1];
		this.uID=this.getUID();
		this.catcher=false;
		this.move=false;
	}
	updatePosition(positions,id){
		this.position=positions;
		this.id=id;
		this.transform.setEye(this.position[0],this.position[1],this.position[2]+1.5);
		this.uID=this.getUID();
		this.arrows.forEach(function (arrow) {
			arrow.updatePosition(positions)
		});
	}
	updateCenter(position){
		this.transform.setCenter(position[0],position[1],position[2]+1.5);
	}
	clearTranslation(){
		this.transform.translateTo(0,0,0);
		this.arrows[0].transform.translateTo(0,0,0);
	}
	reset(){
		this.transform.angleX=0;
		this.transform.angleY=0;
		this.transform.angleZ=0;
		this.arrows.forEach(function (arrow) {
			arrow.transform.angleX=0;
			arrow.transform.angleY=0;
			arrow.transform.angleZ=0;
		});
	}
	getUID(){
		return [
			((this.id>>0) & 0xFF)/ 0xFF,
			((this.id>>8) &0xFF)/0xFF,
			((this.id>>16) &0xFF)/0xFF,
			((this.id>>24) &0xFF)/0xFF
		]
	}
	select(){
		this.color=this.selectedColor;
		this.arrows.forEach(function (arrow) {
			arrow.select();
		});
	}
	deselect(){
		this.color=this.normalColor;
		this.arrows.forEach(function (arrow) {
			arrow.deselect();
		});
	}
	configureCatcherMove(fieldArray,n){
		this.catcher=true;
		this.move=true;
		this.destID=Math.floor(Math.random()*(n));
		while(this.destID===this.id){
			this.destID=Math.floor(Math.random()*(n));
		}
		this.dest=fieldArray[this.destID];
		this.moveLength=vec3.distance(this.position,this.dest);
		this.arrows[0].updateCenter(this.dest);
	}
	clearConfiguration(moveSuccess){
		if(this.catcher) this.deselect();
		this.updateCenter([0,0,-5]);
		if(moveSuccess) this.updatePosition(this.dest,this.destID);
		this.clearTranslation();
		this.catcher=false;
		this.move=false;
	}
	configureFreeCorner(fieldArray,positionToMove){
		this.move=true;
		this.destID=positionToMove;
		this.dest=fieldArray[positionToMove];
		this.moveLength=vec3.distance(this.position,this.dest);
		this.arrows[0].updateCenter(this.dest);
	}
	movePlayer(fraction){
		this.updateCenter(this.dest);
		this.transform.translateTo(0,0,-this.moveLength*fraction);
		this.arrows[0].transform.translateTo(0,0,-this.moveLength*fraction);
	}
}