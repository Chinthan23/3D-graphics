import webglObjLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import {Transform} from "../lib/transform.js"
import { Arrow } from './Arrow.js';

export class Model{
	constructor(color,modelPath,initialFieldPosition,id){
		this.type="Model";
		this.modelPath=modelPath;
		this.transform = new Transform();
		this.normalColor=color;
		this.selectedColor=[0.1,0.5,0.5,0.5];
		this.color=color;
		this.position=initialFieldPosition;
		this.transform.setEye(this.position[0],this.position[1],this.position[2]+1);
		this.transform.translateTo(0,0,0);
		this.arrows=[new Arrow(color,initialFieldPosition)];
		this.id=id;
		this.light=[0,0,-1];
		this.uID=this.getUID();
	}
	async loadModel(){
		const response= await fetch(this.modelPath);
		const text=await response.text();
		this.mesh=new webglObjLoader.Mesh(text);
		this.vertices=this.mesh.vertices;
		this.indices=this.mesh.indices;
		this.vertexNormals=this.mesh.vertexNormals;
		return true;
	}
	updatePosition(positions,id){
		this.position=positions;
		this.id=id;
		this.uID=this.getUID();
		this.transform.setEye(this.position[0],this.position[1],this.position[2]+1);
		// this.transform.translateTo(this.position[0],this.position[1],this.position[2]+1);
		this.arrows.forEach(function (arrow) {
			arrow.updatePosition(positions)
		});
	}
	updateCenter(position){
		this.transform.setCenter(position[0],position[1],position[2]+1);
		this.arrows[0].updateCenter(position);
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
}