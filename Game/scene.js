import {vec3,mat4, quat} from "../lib/threeD.js";
import {Field} from "./Field.js";
import {Model} from "../models/Model.js"
export class Scene
{
	constructor(width, height)
	{
		this.field= new Field(2,4,5);
		this.cube= new Model([1,0,0,1]);
		this.models = [this.field,this.cube]
		this.mode=1;
		this.cameraChange=false;
		//Keeping the view and projection matrices in the scene as they are global properties and apply to all models.
		this.eyeVector=vec3.create();
		this.eyeVector2=vec3.create();
		vec3.set(this.eyeVector,0,0,5)
		vec3.set(this.eyeVector2,0,-10,0)

		this.upVector=vec3.create();
		this.upVector2=vec3.create();
		vec3.set(this.upVector,0,1,0);
		vec3.set(this.upVector2,0,0,1);

		this.centerVector=vec3.create();
		this.centerVector2=vec3.create();
		vec3.set(this.centerVector,0,0,0);
		vec3.set(this.centerVector2,0,0,0);

		this.globalRotationAxis=vec3.create();
		this.localViewMatrix=mat4.create();
		this.globalViewMatrix=mat4.create();
		mat4.lookAt(this.localViewMatrix,this.eyeVector,this.centerVector,this.upVector);
		mat4.lookAt(this.globalViewMatrix,this.eyeVector2,this.centerVector2,this.upVector2);
		this.viewMatrix=this.localViewMatrix;
		// mat4.invert(this.viewMatrix,this.viewMatrix);

		this.rotationQuaternion=quat.create();
		this.near=1e-4;
		this.far=1e10;
		this.projectionMatrix=mat4.create();
		mat4.perspective(this.projectionMatrix,75*Math.PI/180,width/height,this.near,this.far);
		this.loadAllModels();
		this.cube.transform.translateTo(5,0,-1);
	}

	async loadAllModels(){
		const response=await this.cube.loadModel("../models-blender/Sculpt/Sculpt.obj");
		this.modelsLoaded=response;
		return response;
	}
	add(primitive)
	{
		if( this.primitives && primitive )
		{
			this.primitives.push(primitive)
			console.log(primitive)
		}
	}
	updateViewMatrixOnModeChange(mode){
		this.viewMatrix=mode===1? this.localViewMatrix:this.globalViewMatrix;
		// mat4.invert(this.viewMatrix,this.viewMatrix);
	}
	globalTrackball(initialCoordinates,finalCoordinates){
		let theta=vec3.angle(initialCoordinates,finalCoordinates)*2.5;
		vec3.cross(this.globalRotationAxis,initialCoordinates,finalCoordinates);
		let tempquat=quat.create();
		quat.setAxisAngle(tempquat,this.globalRotationAxis,theta);
		quat.normalize(tempquat,tempquat);
		quat.multiply(this.rotationQuaternion,this.rotationQuaternion,tempquat);
		quat.normalize(this.rotationQuaternion,this.rotationQuaternion);
		const tempMatrix=mat4.create();
		mat4.fromQuat(tempMatrix,this.rotationQuaternion)
		mat4.multiply(this.globalViewMatrix,this.globalViewMatrix,tempMatrix);
	}
	setQuatIdentity(){
		quat.identity(this.rotationQuaternion);
	}
	processEvent(event){
		if(event.key === 'c'){
			this.mode= this.mode===1? 2:1;
			this.cameraChange=true;
			this.updateViewMatrixOnModeChange(this.mode);
		}
	}
}