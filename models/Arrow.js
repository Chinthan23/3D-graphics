import webglObjLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import {Transform} from "../lib/transform.js";
import { arrowObj } from './arrowObj.js';

export class Arrow{
	constructor(color,initialFieldPosition){
		this.type = 'arrow';
		this.color=color;
		this.normalColor=color;
		this.selectedColor=[0.1,0.5,0.5,0.5];
		this.position=initialFieldPosition;
		this.transform= new Transform();
		this.transform.translateTo(this.position[0],this.position[1],this.position[2]+1);
		this.mesh= new webglObjLoader.Mesh(arrowObj);
		this.vertices=this.mesh.vertices;
		this.indices=this.mesh.indices;
		this.vertexNormals=this.mesh.vertexNormals;
	}
	updatePosition(positions){
		this.position=positions;
		this.transform.translateTo(this.position[0],this.position[1],this.position[2]+1);
	}
	select(){
		this.color=this.selectedColor;
	}
	deselect(){
		this.color=this.normalColor;
	}
}
