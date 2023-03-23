import webglObjLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import {Transform} from "../lib/transform.js"

export class Model{
	constructor(color,modelPath,initialFieldPosition){
		this.type="Model";
		this.modelPath=modelPath;
		this.transform = new Transform();
		this.color=color;
		this.position=initialFieldPosition;
		this.transform.translateTo(initialFieldPosition[0],initialFieldPosition[1],initialFieldPosition[2]);
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

}