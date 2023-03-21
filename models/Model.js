import webglObjLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import {Transform} from "../lib/transform.js"
import {cube} from "./cube.js";
import {arrow} from "./arrow.js";

export class Model{
	constructor(color,num=1){
		this.mesh= new webglObjLoader.Mesh(num===1?cube:arrow);
		this.vertices=this.mesh.vertices;
		this.indices=this.mesh.indices;
		this.type="Model";
		this.transform = new Transform();
		this.color=color===undefined?[1,0,0,1]:color;
	}
	loadModel(pathname){
		return new webglObjLoader.Mesh(pathname);
	}

}