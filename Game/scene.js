import {vec3,mat4, quat} from "../lib/threeD.js";
import {Field} from "./Field.js";
import {Model} from "./Model.js"
export class Scene
{
	constructor(width, height)
	{
		this.field= new Field(2,3,5);
		this.xax=new Model([1,0,0,1],2);
		this.zax=new Model([0,0,1,1],2);
		console.log(this)
		this.models = [this.field,this.xax,new Model([0,1,0,1],2),this.zax]
		this.setaxis(this.models);
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

		this.localViewMatrix=mat4.create();
		this.globalViewMatrix=mat4.create();
		mat4.lookAt(this.localViewMatrix,this.eyeVector,this.centerVector,this.upVector);
		mat4.lookAt(this.globalViewMatrix,this.eyeVector2,this.centerVector2,this.upVector2);
		this.viewMatrix=this.localViewMatrix;
		// mat4.invert(this.viewMatrix,this.viewMatrix);

		this.near=1e-4;
		this.far=1e4;
		this.projectionMatrix=mat4.create();
		mat4.perspective(this.projectionMatrix,75*Math.PI/180,width/height,this.near,this.far);
	}
	setaxis(model){
		model[1].transform.translate=[2.4,0,0];
		model[2].transform.translate=[2.4,0,0];
		model[3].transform.translate=[2.4,0,0];
		model[2].transform.rotationAngle=90;
		model[2].transform.rotationAxis=[0,0,1];
		model[3].transform.rotationAngle=-90;
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
	globalTrackball(initialCoordinates,FinalCoordinates){
		console.log(initialCoordinates,FinalCoordinates);

	}
	processEvent(event){
		if(event.key === 'c'){
			this.mode= this.mode===1? 2:1;
			this.cameraChange=true;
			this.updateViewMatrixOnModeChange(this.mode);
		}
	}
}