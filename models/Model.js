import webglObjLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import {Transform} from "../lib/transform.js"

export class Model{
	constructor(color,num=1){
		this.type="Model";
		this.transform = new Transform();
		this.color=color===undefined?[1,0,0,1]:color;
	}
	async loadModel(pathname){
		const response= await fetch(pathname);
		const text=await response.text();
		this.mesh=new webglObjLoader.Mesh(text);
		this.vertices=this.mesh.vertices;
		this.indices=this.mesh.indices;
		this.vertexNormals=this.mesh.vertexNormals;
		return true;
	}

}