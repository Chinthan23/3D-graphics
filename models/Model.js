import webglObjLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import {Transform} from "../lib/transform.js"

export class Model{
	constructor(color,modelPath,initialFieldPosition,id){
		this.type="Model";
		this.modelPath=modelPath;
		this.transform = new Transform();
		this.normalColor=color;
		this.selectedColor=[0.1,0.5,0.5,0.5];
		this.color=color;
		this.position=initialFieldPosition;
		this.transform.translateTo(this.position[0],this.position[1],this.position[2]+1);
		// this.transform.rotX(90*Math.PI/180);
		this.id=id;
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
		this.transform.translateTo(this.position[0],this.position[1],this.position[2]);
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
	}
	deselect(){
		this.color=this.normalColor;
	}
}